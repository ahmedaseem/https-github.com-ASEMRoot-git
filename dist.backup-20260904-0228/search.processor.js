var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SEARCH_QUEUE } from './search.queue.js';
let SearchProcessor = class SearchProcessor extends WorkerHost {
    async process(job) {
        switch (job.name) {
            case 'index-user':
                console.log(job.data);
                break;
            case 'update-user':
                console.log(job.data);
                break;
            case 'delete-user':
                console.log(job.data);
                break;
        }
    }
};
SearchProcessor = __decorate([
    Processor(SEARCH_QUEUE)
], SearchProcessor);
export { SearchProcessor };
//# sourceMappingURL=search.processor.js.map