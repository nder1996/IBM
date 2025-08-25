export class TaskRequest {
    constructor(
        public resultCode?: number,
        public firstName?: string,
        public lastName?: string,
        public age?: string,
        public profilePhoto?: string,
        public video?: Date
    ) {}
  }
