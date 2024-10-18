import { EventLog } from '../entity/EventLog';

export class PaginatedEventLogDTO {
    current_page: number;
    data: EventLog[];
    from: number;
    to: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    first_page_url: string;

    constructor(
        currentPage: number,
        data: EventLog[],
        from: number,
        to: number,
        perPage: number,
        total: number,
        nextPageUrl: string | null,
        prevPageUrl: string | null,
        firstPageUrl: string
    ) {
        this.current_page = currentPage;
        this.data = data;
        this.from = from;
        this.to = to;
        this.per_page = perPage;
        this.total = total;
        this.next_page_url = nextPageUrl;
        this.prev_page_url = prevPageUrl;
        this.first_page_url = firstPageUrl;
    }
}
