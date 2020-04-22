import React from 'react';

import FilterTable from 'app/components/FilterTable';

interface FishListProps {
}

const FishList: React.FC<FishListProps> = (props) => {
	document.title = 'Fish List | ACE';

	return (
		<FilterTable />
	);
};

export default FishList;
