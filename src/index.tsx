import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createHashRouter([
	{
		path: "/c",
		children: [
			{
				path: ":characterId",
				lazy: () => import("./main-app/MainApp"),
			},
			{
				index: true,
				lazy: () => import("./main-app/MainApp"),
			},
		],
	},
	{
		path: "/editor",
		children: [
			{
				path: ":cardId",
				lazy: () => import("./editor-app/EditorApp"),
			},
			{
				index: true,
				lazy: () => import("./editor-app/EditorApp"),
			},
		],
	},
	{
		index: true,
		element: <Navigate to="/c" replace />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
