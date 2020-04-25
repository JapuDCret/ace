import React from 'react';

import MaterialTable, { MaterialTableProps, Options } from 'material-table';

import MaterialTableIcons from 'app/components/EnhancedTable/material-table-icons';

type ForceRequired<T, TRequired extends keyof T> = T & Required<Pick<T, TRequired>>;

interface EnhancedTableProps<RowData extends object> extends MaterialTableProps<RowData> {
	options: ForceRequired<Options, 'search' | 'columnsButton' | 'paging' | 'sorting'>;
}

type CMTableDefaultProps<RowData extends object> = Partial<MaterialTableProps<RowData>>;

function withWrappingOptions<RowData extends object>() {
	return function<T extends EnhancedTableProps<RowData>>(
		WrappedMaterialTable: React.ComponentType<MaterialTableProps<RowData>>,
	): React.ReactNode {
		const defaultProps: CMTableDefaultProps<RowData> = {
			icons: MaterialTableIcons,
			// options: {
			// 	headerStyle: {
			// 		backgroundColor: CustomTheme.palette.primary.main,
			// 	},
			// },
		};

		// eslint-disable-next-line react/display-name
		return function(props: T): React.ReactNode {
			// const mergedOptions = {
			// 	...defaultProps.options,
			// 	...props.options,
			// };

			return (
				// <MuiThemeProvider theme={TableTheme}>
					<WrappedMaterialTable
					{...defaultProps}
					{...props}
					// options={mergedOptions}
					/>
				// </MuiThemeProvider>
			);
		};
	};
}

export const EnhancedTable = withWrappingOptions()(MaterialTable) as <RowData extends object>(
	props: EnhancedTableProps<RowData>,
) => React.ReactElement;
