import bcrypt from 'bcrypt';

export async function hashValue(value: string): Promise<string> {
	const saltRounds = 10; // You can adjust the salt rounds as needed
	try {
		const hash = await bcrypt.hash(value, saltRounds);
		return hash;
	} catch (error) {
		throw new Error(`Error hashing value: ${error}`);
	}
}

/* // Example usage:
hashValue('yourValueToHash')
	.then(hash => console.log(`Hashed value: ${hash}`))
	.catch(error => console.error(`Error: ${error.message}`));
 */


export async function compareValue(value: string, hash: string): Promise<boolean> {
    try {
        const result = await bcrypt.compare(value, hash);
        return result;
    } catch (error) {
        throw new Error(`Error comparing values: ${error}`);
    }
}

