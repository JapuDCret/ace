import React from 'react';

import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';

import { DataItem, useStyles } from 'app/components/EnhancedTable/EnhancedTable';

export type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof DataItem;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{ id: 'id', numeric: true, disablePadding: true, label: 'Id' },
	{ id: 'name', numeric: false, disablePadding: false, label: 'Name' },
	{ id: 'location', numeric: false, disablePadding: false, label: 'Location' },
	{ id: 'price', numeric: true, disablePadding: false, label: 'Price' },
	{ id: 'shadow_size', numeric: false, disablePadding: false, label: 'Shadow Size' },
	{ id: 'time_of_day', numeric: false, disablePadding: false, label: 'Time of Day' },
	{ id: 'rarity', numeric: false, disablePadding: false, label: 'rarity' },
	{ id: 'scientific_name', numeric: false, disablePadding: false, label: 'scientific_name' },
	{ id: 'size', numeric: false, disablePadding: false, label: 'size' },
];

interface EnhancedTableHeadProps {
	classes: ReturnType<typeof useStyles>;
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DataItem) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = (props) => {
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = (property: keyof DataItem) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

export default EnhancedTableHead;