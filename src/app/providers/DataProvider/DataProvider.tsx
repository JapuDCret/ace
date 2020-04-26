import React, { useState, createContext, FC } from 'react';

import { useTranslation } from 'react-i18next';

import useAsyncEffect from 'use-async-effect';

import { readCsvFile } from 'app/utils/request-utils';
import * as fishCsvFile from 'assets/data/fish.csv';
import * as fishTranslationsCsvFile from 'assets/data/fish-translations.csv';
import * as crittersCsvFile from 'assets/data/critters.csv';

export type ShadowSize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'VeryLarge';

export interface SpawnTime {
	label: string;
	start: string;
	startHours: number;
	startMinutes: number;
	end: string;
	endHours: number;
	endMinutes: number;
}

export interface Creature {
	id: number;
	name: string;
	price: number;
	location: string;
	times: Array<SpawnTime>;
	jan: boolean;
	feb: boolean;
	mar: boolean;
	apr: boolean;
	may: boolean;
	jun: boolean;
	jul: boolean;
	aug: boolean;
	sep: boolean;
	oct: boolean;
	nov: boolean;
	dec: boolean;
}

export interface Fish extends Creature {
	shadow: ShadowSize;
}

export interface FishTranslations {
	id: number;
	'en-US': string;
	'de-DE': string;
}

export interface Critter extends Creature {}

interface AppData {
	fish: Fish[];
	critters: Critter[];
}

const defaultData: AppData = {
	fish: [],
	critters: [],
};

export const DataContext = createContext<AppData>(defaultData);

function parseSpawnTimes(spawnBracketsRaw: string): Array<SpawnTime> {
	const spawnTimes = new Array<SpawnTime>();

	const spawnBrackets = spawnBracketsRaw.split(' ; ');
	for (const spawnBracket of spawnBrackets) {
		if (spawnBracket === 'All day') {
			spawnTimes.push({
				label: spawnBracket,
				start: '00:00',
				startHours: 0,
				startMinutes: 0,
				end: '24:00',
				endHours: 24,
				endMinutes: 0,
			});

			continue;
		}
		const delimiterPos = spawnBracket.indexOf(' - ');
		if (delimiterPos < 0) {
			throw new Error('invalid data, delimiterPos < 0! spawnBracket = ' + spawnBracket);
		}
		const start = spawnBracket.substring(0, delimiterPos);

		const startDelimiterPos = start.indexOf(':');
		const startHours = Number(start.substring(0, startDelimiterPos));
		const startMinutes = Number(start.substring(startDelimiterPos + 1));

		const end = spawnBracket.substring(delimiterPos + 3);

		const endDelimiterPos = end.indexOf(':');
		const endHours = Number(end.substring(0, endDelimiterPos));
		const endMinutes = Number(end.substring(endDelimiterPos + 1));

		spawnTimes.push({
			label: spawnBracket,
			start,
			startHours,
			startMinutes,
			end,
			endHours,
			endMinutes,
		});
	}

	return spawnTimes;
}

const getFishTranslationData = async (): Promise<FishTranslations[]> => {
	const rawDataTranslations = await readCsvFile(fishTranslationsCsvFile);
	const fishTranslationData = new Array<FishTranslations>();

	for (const entry of rawDataTranslations) {
		fishTranslationData.push({
			id: Number(entry[0]),
			'en-US': entry[1],
			'de-DE': entry[2],
		});
	}

	return fishTranslationData;
};

const findTranslation = (language: string, itemId: number, translations: FishTranslations[]): string => {
	const obj = translations.find((trans) => trans.id === itemId);

	if (!obj) {
		throw new Error(`No ${language} translations found for fish ${itemId}`);
	}

	return obj[language as keyof FishTranslations] as string;
};

const parseFish = (language: string, fishTranslations: FishTranslations[], entry: string[]): Fish => {
	return {
		id: Number(entry[0]),
		name: findTranslation(language, Number(entry[0]), fishTranslations),
		price: Number(entry[2]),
		location: entry[3],
		shadow: entry[4] as ShadowSize,
		times: parseSpawnTimes(entry[5]),
		jan: entry[6] === '1',
		feb: entry[7] === '1',
		mar: entry[8] === '1',
		apr: entry[9] === '1',
		may: entry[10] === '1',
		jun: entry[11] === '1',
		jul: entry[12] === '1',
		aug: entry[13] === '1',
		sep: entry[14] === '1',
		oct: entry[15] === '1',
		nov: entry[16] === '1',
		dec: entry[17] === '1',
	};
};

const parseCritter = (entry: string[]): Critter => {
	return {
		id: Number(entry[0]),
		// name: findTranslation(language, Number(entry[0]), fishTranslations),
		name: entry[1],
		price: Number(entry[2]),
		location: entry[3],
		times: parseSpawnTimes(entry[4]),
		jan: entry[5] === '1',
		feb: entry[6] === '1',
		mar: entry[7] === '1',
		apr: entry[8] === '1',
		may: entry[9] === '1',
		jun: entry[10] === '1',
		jul: entry[11] === '1',
		aug: entry[12] === '1',
		sep: entry[13] === '1',
		oct: entry[14] === '1',
		nov: entry[15] === '1',
		dec: entry[16] === '1',
	};
};

const DataProvider: FC<{}> = ({ children }) => {
	const [data, setData] = useState<AppData>(defaultData);

	const {
		i18n: { language },
	} = useTranslation();

	useAsyncEffect(async () => {
		const fishTranslations: FishTranslations[] = await getFishTranslationData();

		const rawFishData = await readCsvFile(fishCsvFile);

		const fishData = rawFishData.map((entry) => parseFish(language, fishTranslations, entry));

		const rawCritterData = await readCsvFile(crittersCsvFile);

		const critterData = rawCritterData.map((entry) => parseCritter(entry));

		console.log('critterData = ', critterData);

		setData({
			...data,
			fish: fishData,
			critters: critterData,
		});
	}, [language]);

	return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export default DataProvider;
