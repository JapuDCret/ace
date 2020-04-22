import React from 'react';

import FilterTable from 'app/components/FilterTable/FilterTable';
import data from 'app/mocks/data';

interface FishListProps {}

const FishList: React.FC<FishListProps> = (props) => {
	document.title = 'Fish List | ACE';

	return <FilterTable data={data.fish} />;
};

export default FishList;
