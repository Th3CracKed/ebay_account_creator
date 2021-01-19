export async function findAsync<T>(array: T[], predicate: (value: T, index?: number, obj?: T[]) => Promise<boolean>): Promise<T> {
    const candidates = await Promise.all(array.map(predicate));
    const index = candidates.findIndex(candidate => candidate);
    return array[index];
}
