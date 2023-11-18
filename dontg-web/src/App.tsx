import { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import FoodItems from "./pages/FoodItems";
import Login from "./pages/Login";
import AuthProvider from "./providers/AuthProvider";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp, { db } from "./firebase";
import { useDispatch } from "react-redux";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { setUser } from "./store/slices/userSlice";

import CreateDietChartPage from "./pages/DietChart/Create";
import UpdateDietChartPage from "./pages/DietChart/Update";
import DietChartListPage from "./pages/DietChart/List";

const router = createHashRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <AuthProvider />,
        children: [
            { path: "/", element: <DietChartListPage /> },
            { path: "/create", element: <CreateDietChartPage /> },
            { path: "/chart/:chartId", element: <UpdateDietChartPage /> },
            { path: "/food-items", element: <FoodItems /> },
        ],
    },
]);

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(firebaseApp), async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                let userData = userDoc.data();
                if (userData) userData.dob = userData?.dob?.toDate().toLocaleDateString();
                if (!userDoc.exists()) {
                    userData = {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        height: null,
                        weight: null,
                        dob: null,
                    };
                    try {
                        await setDoc(doc(collection(db, "users"), user.uid), userData);
                    } catch (e) {
                        console.log(e);
                    }
                }
                dispatch(
                    setUser({
                        id: user.uid,
                        ...userData,
                        photoURL: user.photoURL,
                    })
                );
            } else {
                dispatch(setUser(null));
            }
        });
        return () => unsubscribe();
    }, []);
    return <RouterProvider router={router} />;
};

export default App;
