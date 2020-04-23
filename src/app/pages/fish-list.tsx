import React from 'react';

import EnhancedTable from 'app/components/EnhancedTable';
import data from 'app/mocks/data';

interface FishListProps {}

const FishList: React.FC<FishListProps> = (props) => {
	document.title = 'Fish List | ACE';

	return <EnhancedTable data={data.fish} />;
};

export default FishList;
