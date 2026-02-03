// AG Charts Module Registration
// Required for AG Charts v10+ to register chart modules before use

'use client';

import { AllCommunityModule, ModuleRegistry } from 'ag-charts-community';

// Register all community modules (includes Line, Bar, Pie, Area, etc.)
// This needs to be called once before any chart is rendered
ModuleRegistry.registerModules([AllCommunityModule]);

export { ModuleRegistry };
