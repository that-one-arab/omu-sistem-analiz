export const switchRaporHeader = (queryParam) => {
    switch (queryParam) {
        case "approved":
            return "onaylanan"
        case "rejected":
            return "iptal edilen"
        case "processing":
            return "beklemede olan"
        default:
            break;
    }
}