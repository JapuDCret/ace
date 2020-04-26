import React, { FC, useState, useContext, useMemo } from 'react';

import { Column } from 'material-table';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { KeyboardTimePicker } from '@material-ui/pickers';

import ClearIcon from '@material-ui/icons/Clear';

import EnhancedTable from 'app/components/EnhancedTable';
import { DataContext, Fish, SpawnTime } from 'app/providers/DataProvider/DataProvider';
import { ConfigContext } from 'app/app';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { getMonthFromDate, MonthAlias } from 'app/utils/date-utils';
import { mapFilesToDictionary } from 'app/utils/request-utils';

const fishImages = mapFilesToDictionary(require.context('assets/img/fish/', false, /\.(png|jpe?g|svg)$/), 'fish');

const columnDefs: Array<Column<Fish>> = [
	{
		title: '',
		field: 'id',
		render: (fish) => {
			return (
				<img src={fishImages[`${fish.id}`]} />
			);
		}
	},
	{
		title: 'Name',
		field: 'name',
	},
	{
		title: 'Price',
		field: 'price',
		type: 'numeric',
	},
	{
		title: 'Location',
		field: 'location',
	},
	{
		title: 'Shadow',
		field: 'shadow',
	},
	{
		title: 'Times',
		field: 'times',
		customSort: (fish1, fish2, type) => {
			const findBiggestSpawnTime = (previousValue: SpawnTime, currentValue: SpawnTime) => {
				if (previousValue.label === 'All day') {
					return currentValue;
				}

				if (previousValue.startHours < currentValue.startHours) {
					return currentValue;
				}

				return previousValue;
			};

			const hoursForFish1 = fish1.times.reduce(findBiggestSpawnTime).startHours;
			const hoursForFish2 = fish2.times.reduce(findBiggestSpawnTime).startHours;

			return hoursForFish1 - hoursForFish2;
		},
		render: (fish) => {
			return (
				<List>
					{fish.times.map((spawnBracket) => {
						return <ListItem key={spawnBracket.label}>{spawnBracket.label}</ListItem>;
					})}
				</List>
			);
		},
	},
];

interface FishListProps {}

const FishList: FC<FishListProps> = (props) => {
	document.title = 'Fish List | ACE';

	const data = useContext(DataContext);
	const config = useContext(ConfigContext);

	const fish = data.fish;

	const now = new Date();

	let currentMonth = getMonthFromDate(now);

	const [timeFilter, setTimeFilter] = useState<Date | null>(now);
	const [monthFilter, setMonthFilter] = useState<MonthAlias[]>([currentMonth]);
	const [locationFilter, setLocationFilter] = useState<string>('');

	const locations = useMemo(() => {
		let fishData = fish;

		const locationSet = new Set<string>();

		for (const fish of fishData) {
			locationSet.add(fish.location);
		}

		return Array.from(locationSet);
	}, [fish]);

	const fishData = useMemo(() => {
		let fishData = fish;

		if (timeFilter != null) {
			// filter time
			fishData = fishData.filter((fish) => {
				for (const spawnBracket of fish.times) {
					if (spawnBracket.label === 'All day') {
						return true;
					}

					let filterMinutes = timeFilter.getHours() * 60 + timeFilter.getMinutes();
					let startMinutes = spawnBracket.startHours * 60 + spawnBracket.startMinutes;
					let endMinutes = spawnBracket.endHours * 60 + spawnBracket.endMinutes;
					if (startMinutes > endMinutes) {
						endMinutes += 24 * 60; // 540 + 3600 => 4140
					}

					if (filterMinutes >= startMinutes) {
						if (filterMinutes <= endMinutes) {
							return true;
						}
					}

					// if the first one didn't match, we'll leap a day: this fixes issues, when the time is 01:23 and very small
					filterMinutes += 24 * 60; // 540 + 3600 => 4140

					if (filterMinutes >= startMinutes) {
						if (filterMinutes <= endMinutes) {
							return true;
						}
					}
				}

				return false;
			});
		}

		if (locationFilter !== '') {
			// filter location
			fishData = fishData.filter((fish) => fish.location === locationFilter);
		}

		if (monthFilter.length > 0) {
			// filter month
			fishData = fishData.filter((fish) => monthFilter.filter((month) => fish[month]).length > 0);
		}

		return fishData;
	}, [fish, timeFilter, locationFilter, monthFilter]);

	return (
		<div>
			<Grid container spacing={4} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
				<Grid item xs={12}>
					<Grid container justify="space-between" spacing={2}>
						<Grid item xs={12} md={6} lg={2}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<TextField
									id="month-filter"
									label="Month"
									select
									SelectProps={{
										multiple: true,
									}}
									variant="outlined"
									fullWidth
									value={monthFilter}
									onChange={(e) => {
										setMonthFilter((e.target.value as any) as MonthAlias[]);
									}}
								>
									{/* <MenuItem key={'empty'} value={''}></MenuItem> */}
									<MenuItem key={'jan'} value={'jan'}>
										January
									</MenuItem>
									<MenuItem key={'feb'} value={'feb'}>
										February
									</MenuItem>
									<MenuItem key={'mar'} value={'mar'}>
										March
									</MenuItem>
									<MenuItem key={'apr'} value={'apr'}>
										April
									</MenuItem>
									<MenuItem key={'may'} value={'may'}>
										May
									</MenuItem>
									<MenuItem key={'jun'} value={'jun'}>
										June
									</MenuItem>
									<MenuItem key={'jul'} value={'jul'}>
										July
									</MenuItem>
									<MenuItem key={'aug'} value={'aug'}>
										August
									</MenuItem>
									<MenuItem key={'sep'} value={'sep'}>
										September
									</MenuItem>
									<MenuItem key={'oct'} value={'oct'}>
										October
									</MenuItem>
									<MenuItem key={'nov'} value={'nov'}>
										November
									</MenuItem>
									<MenuItem key={'dec'} value={'dec'}>
										December
									</MenuItem>
								</TextField>
								<IconButton onClick={() => setMonthFilter([])}>
									<ClearIcon />
								</IconButton>
							</div>
						</Grid>

						<Grid item xs={12} md={6} lg={2}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<KeyboardTimePicker
									margin="none"
									id="time-filter"
									label="Time"
									fullWidth
									value={timeFilter}
									inputVariant="outlined"
									onChange={(date) => {
										setTimeFilter(date);
									}}
									KeyboardButtonProps={{
										'aria-label': 'change time',
									}}
									ampm={config.useAmericanTimeFormat}
									clearable={true}
								/>
								<IconButton onClick={() => setTimeFilter(null)}>
									<ClearIcon />
								</IconButton>
							</div>
						</Grid>

						<Grid item xs={12} md={6} lg={2}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<TextField
									id="location-filter"
									label="Location"
									select
									variant="outlined"
									fullWidth
									value={locationFilter}
									onChange={(e) => setLocationFilter(e.target.value)}
								>
									<MenuItem key={'empty'} value={''}></MenuItem>
									{locations.map((location) => {
										return (
											<MenuItem key={location} value={location}>
												{location}
											</MenuItem>
										);
									})}
								</TextField>
								<IconButton onClick={() => setLocationFilter('')}>
									<ClearIcon />
								</IconButton>
							</div>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<EnhancedTable
						title={`Fish List (${fishData.length}/${data.fish.length})`}
						columns={columnDefs}
						data={fishData}
						options={{
							search: true,
							columnsButton: true,
							paging: false,
							sorting: true,
						}}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default FishList;
