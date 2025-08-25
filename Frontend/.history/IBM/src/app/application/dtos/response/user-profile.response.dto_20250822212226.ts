export class TaskRequest {
    constructor(
        public resultCode?: number,
        public firstName?: string,
        public lastName?: string,
        public age?: string,
        public profilePhoto?: string,
        public CreatedAt?: Date,
        public UpdatedAt?: Date,
        public due_date?: Date
    ) {}
  }
