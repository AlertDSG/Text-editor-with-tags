
export const searchTags = (value: string): null | string => {
    let tag = null;

    let newValue = value.split(/(#[a-z\d-]+)/ig)
    for (let i = 0; i < newValue.length; i++) {
        if (newValue[i][0] === '#') {
            tag = newValue[i]
        }
    }
    return tag
}