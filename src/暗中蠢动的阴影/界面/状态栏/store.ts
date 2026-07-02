import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// Use message_id: -1 (latest) to avoid calling getCurrentMessageId()
// from the global script context of the streaming frontend.
// stat_data is a persistent variable accessible from any message.
export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message' as const,
  message_id: -1,
});
