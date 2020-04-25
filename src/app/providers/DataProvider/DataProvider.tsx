import React from 'react';

import { useTranslation } from 'react-i18next';

import useAsyncEffect from 'use-async-effect';

import { readCsvFile } from 'app/utils/request-utils';
import * as fishCsvFile from 'assets/data/fish.csv';

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

export interface Fish {
    id: number;
    name: string;
    price: number;
    location: string;
    shadow: ShadowSize;
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

interface AppData {
    fish: Fish[];
};

const defaultData: AppData = {
    fish: []
};

export const DataContext = React.createContext<AppData>(defaultData);

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
                endMinutes: 0
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
            endMinutes
        });
    }

    return spawnTimes;
}

const DataProvider: React.FC<{}> = (props) => {
    const [ data, setData ] = React.useState<AppData>(defaultData);

    const { t, i18n } = useTranslation();

    useAsyncEffect(async () => {
        const fishData = new Array<Fish>();

        const rawData = await readCsvFile(fishCsvFile);
        for (const entry of rawData) {
            fishData.push({
                id: Number(entry[0]),
                name: entry[1],
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
            });
        }

        setData({
            fish: fishData
        });
    }, [t, i18n]);

	return (
        <DataContext.Provider value={data}>
		    {props.children}
        </DataContext.Provider>
	);
};

export default DataProvider;
