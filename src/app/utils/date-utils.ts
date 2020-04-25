export type MonthAlias = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

export function getMonthFromDate(date: Date): MonthAlias {
	const monthNo = date.getMonth();

	switch (monthNo) {
		case 0:
			return 'jan';
			break;
		case 1:
			return 'feb';
			break;
		case 2:
			return 'mar';
			break;
		case 3:
			return 'apr';
			break;
		case 4:
			return 'may';
			break;
		case 5:
			return 'jun';
			break;
		case 6:
			return 'jul';
			break;
		case 7:
			return 'aug';
			break;
		case 8:
			return 'sep';
			break;
		case 9:
			return 'oct';
			break;
		case 10:
			return 'nov';
			break;
		case 11:
			return 'dec';
			break;
	}

	throw new Error('could not match value to a month');
}
