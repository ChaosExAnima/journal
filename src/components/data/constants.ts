import { createContext } from 'react';
import type { DataStoreContext } from './types';

export const APIDateFormat = 'YYYY-MM-DD';
export const LoadingState = Symbol( 'loading state' );

export const DataContext = createContext< null | DataStoreContext >( null );
