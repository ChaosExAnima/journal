/// <reference types="react-scripts" />

import { ReactNode } from 'react';

type PropsChildren = { children?: ReactNode };

declare module 'draft-js-autolist-plugin' {
	function createAutoListPlugin(): any;
	export default createAutoListPlugin;
}
