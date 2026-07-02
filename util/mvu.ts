import { StoreDefinition } from 'pinia';

export function defineMvuDataStore<T extends z.ZodObject>(
  schema: T,
  variable_option: VariableOption | (() => VariableOption),
  additional_setup?: (data: Ref<z.infer<T>>) => void,
): StoreDefinition<`mvu_data.${string}`, { data: Ref<z.infer<T>> }> {
  const resolveOption = (): VariableOption => {
    const opt = typeof variable_option === 'function' ? variable_option() : { ...variable_option };
    if (opt.type === 'message' && (opt.message_id === undefined || opt.message_id === 'latest')) {
      opt.message_id = -1;
    }
    return opt;
  };

  return defineStore(
    `mvu_data.${_(resolveOption())
      .entries()
      .sortBy(entry => entry[0])
      .map(entry => entry[1])
      .join('.')}`,
    errorCatched(() => {
      const data = ref(
        schema.parse(_.get(getVariables(resolveOption()), 'stat_data', {}), { reportInput: true }),
      ) as Ref<z.infer<T>>;
      if (additional_setup) {
        additional_setup(data);
      }

      const { pause, resume } = useIntervalFn(() => {
        const opt = resolveOption();
        const stat_data = _.get(getVariables(opt), 'stat_data', {});
        const result = schema.safeParse(stat_data);
        if (result.error) {
          return;
        }
        if (!_.isEqual(data.value, result.data)) {
          ignoreUpdates(() => {
            data.value = result.data;
          });
          if (!_.isEqual(stat_data, result.data)) {
            updateVariablesWith(variables => _.set(variables, 'stat_data', result.data), opt);
          }
        }
      }, 2000);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          pause();
        } else {
          resume();
        }
      });

      const { ignoreUpdates } = watchIgnorable(
        data,
        new_data => {
          const opt = resolveOption();
          const result = schema.safeParse(new_data);
          if (result.error) {
            return;
          }
          if (!_.isEqual(new_data, result.data)) {
            ignoreUpdates(() => {
              data.value = result.data;
            });
          }
          updateVariablesWith(variables => _.set(variables, 'stat_data', result.data), opt);
        },
        { deep: true },
      );

      return { data };
    }),
  );
}
