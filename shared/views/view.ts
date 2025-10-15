export interface View {
    render(): string;
    onMount?(): void;
    onUnmount?(): void;
}

