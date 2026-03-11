export function isEmpty(arr: string[]) {
    for (let item in arr) {
        if (item == "") {
            return true
        }
    }
    return false
}