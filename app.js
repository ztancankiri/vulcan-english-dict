const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const BASE_URL_1 = "https://www.starbase-10.de/vld/main.php?cmd=v2e&letter=";
const BASE_URL_2 = "https://www.starbase-10.de/vld/main.php?cmd=e2v&letter=";

async function getDict() {
	const vulcanToEnglish = {};

	for (const letter of ALPHABET) {
		let response = await axios.get(`${BASE_URL_1}${letter}`);
		let $ = cheerio.load(response.data);
		let table = $("table");
		let trs = $(table).find("tr");

		for (const tr of trs) {
			const tds = $(tr).find("td");
			const vulcan = $(tds[0]).text();
			const english = $(tds[1]).text();
			vulcanToEnglish[vulcan] = english;
		}

		response = await axios.get(`${BASE_URL_2}${letter}`);
		$ = cheerio.load(response.data);
		table = $("table");
		trs = $(table).find("tr");

		for (const tr of trs) {
			const tds = $(tr).find("td");
			const vulcan = $(tds[0]).text();
			const english = $(tds[1]).text();
			vulcanToEnglish[vulcan] = english;
		}
	}

	return vulcanToEnglish;
}

async function main(input) {
	const dictionary = await getDict();
	fs.writeFileSync("dict.json", JSON.stringify(dictionary, null, "\t"));

	// const dictionary = JSON.parse(fs.readFileSync("dict.json"));

	const final = input
		.split(" ")
		.map((word) => {
			const translation = dictionary[word];
			if (translation) {
				return translation;
			} else {
				return word;
			}
		})
		.reduce((sentence, word) => {
			sentence += word + " ";
			return sentence;
		}, "");

	console.log(final);
}

main("I really spo' du teraya-martaya me na' mu-yor");
