import React, { useContext, useMemo } from 'react';

import { Column } from 'material-table';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { KeyboardTimePicker } from '@material-ui/pickers';

import ClearIcon from '@material-ui/icons/Clear';

import EnhancedTable from 'app/components/EnhancedTable';
import { DataContext, Fish } from 'app/providers/DataProvider/DataProvider';
import { ConfigContext } from 'app/app';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { getMonthFromDate, MonthAlias } from 'app/utils/date-utils';

const columnDefs: Array<Column<Fish>> = [
	{
		title: '#',
		field: 'id',
		type: 'numeric',
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
		render: (data) => {
			return (
				<List>
					{data.times.map((spawnBracket) => {
						return <ListItem key={spawnBracket.label}>{spawnBracket.label}</ListItem>;
					})}
				</List>
			);
		},
	},
];

interface FishListProps {}

const FishList: React.FC<FishListProps> = (props) => {
	document.title = 'Fish List | ACE';

	const data = useContext(DataContext);
	const config = useContext(ConfigContext);

	const now = new Date();

	let currentMonth = getMonthFromDate(now);

	const [timeFilter, setTimeFilter] = React.useState<Date | null>(now);
	const [monthFilter, setMonthFilter] = React.useState<MonthAlias[]>([currentMonth]);
	const [locationFilter, setLocationFilter] = React.useState<string>('');

	console.log('data.fish = ', data.fish);

	const locations = useMemo(() => {
		let fishData = data.fish;

		const locationSet = new Set<string>();

		for (const fish of fishData) {
			locationSet.add(fish.location);
		}

		return Array.from(locationSet);
	}, [data.fish]);

	const fishData = useMemo(() => {
		let fishData = data.fish;

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
						endMinutes += 24 * 60;
					}

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
			fishData = fishData.filter((fish) => {
				let isWithinMonth = false;

				for (const month of monthFilter) {
					const doesSpawnThisMonth = fish[month];

					isWithinMonth = isWithinMonth || doesSpawnThisMonth;
				}

				return isWithinMonth;
			});
		}

		return fishData;
	}, [data, timeFilter, locationFilter, monthFilter]);

	console.log('fishData = ', fishData);

	return (
		<div>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Grid container justify="space-around">
						<Grid item xs={2} alignItems="center">
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
										console.log('e.target.value = ', e.target.value);
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

						<Grid item xs={2} alignItems="center">
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<KeyboardTimePicker
									margin="normal"
									id="time-filter"
									label="Time"
									fullWidth
									value={timeFilter}
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

						<Grid item xs={2} alignItems="center">
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
						title="Fish List"
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
