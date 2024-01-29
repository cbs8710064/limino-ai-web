import type { VideoTaskStatus } from "./api";

export type VideoItem = {
    url: string;
    poster?: string;
    isReady?: boolean;
    id?: string;
    progress?: number;
    status?: VideoTaskStatus
}