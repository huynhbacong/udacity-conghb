const logError = (err: Error, property : string): void => {
    console.log(`${property} has ${err}.`);
}

export default logError;