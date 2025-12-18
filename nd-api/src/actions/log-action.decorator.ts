import { SetMetadata } from '@nestjs/common';

export const LOG_ACTION_METADATA = 'log_action';

export const LogAction = (actionType: string) => SetMetadata(LOG_ACTION_METADATA, actionType);


