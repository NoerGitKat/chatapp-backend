export class Helpers {
	static toUpperCaseFirstLetter(text: string): string {
		const valueString = text.toLowerCase();
		return valueString
			.split(" ")
			.map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
			.join(" ");
	}

	static toLowerCase(text: string): string {
		return text.toLowerCase();
	}

	static generateRandomIntegers(integerLength: number): number {
		const numbers = "0123456789";
		let result = "";
		const numLength = numbers.length;
		for (let i = 0; i < integerLength; i++) {
			result += numbers.charAt(Math.floor(Math.random() * numLength));
		}
		return parseInt(result, 10);
	}
}
