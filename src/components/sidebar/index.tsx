import React from 'react';
import { Box } from '@material-ui/core';

import SidebarEntries from './entries';
import SidebarTodayButton from './today-button';

export default function Sidebar( { className = '' } ) {
	return (
		<Box className={ className } component="aside">
			<SidebarTodayButton />
			<SidebarEntries />
		</Box>
	);
}
