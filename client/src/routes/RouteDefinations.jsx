import LoginPage from "../components/Auth/LoginPage";
import RegisterPage from "../components/Auth/RegisterPage";
import CartPage from "../components/Cart/CartPage";
import CheckoutForm from "../components/Payment/CheckOutPage";
import UserProfile from "../components/Userprofile";
import HomePage from "../pages/HomePage";
import CategoryPage from "../components/CategoryPage/CategoryPage";
import AllCategoriesPage from "../components/CategoryPage/AllCategoriesPage";
import NotFoundPage from "../components/common/NotFoundPage";

export const routeDefinitions = [
  { path: "/", element: <HomePage /> },
  { path: "/homepage", element: <HomePage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout/:userId", element: <CheckoutForm /> },
  { path: "/userProfile/:userId", element: <UserProfile /> },
  { path: "/category", element: <AllCategoriesPage /> },
  { path: "/category/:categoryId", element: <CategoryPage /> },
  { path: "*", element: <NotFoundPage /> }, // 404 page for any unmatched routes
];