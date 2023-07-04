import {
    Routes,
    Route
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ScrollToTop from '../components/ScrollToTop';
// Pages
import Home from '../pages/Home';
import AnuncieAqui from '../pages/AnuncieAqui';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import EsqueciMinhaSenha from '../pages/EsqueciMinhaSenha';
import Cotacao from '../pages/Cotacao';
import Materias from '../pages/Materias';
import Materia from '../pages/Materia';
import GuiaDeEmpresas from '../pages/GuiaDeEmpresas';
import Anuncio from '../pages/Anuncio';
import NoMatchPage from '../pages/NoMatchPage';
import RequireAuth from '../components/RequireAuth';
// User
import Perfil from '../pages/Perfil';
import MinhasCotacoes from '../pages/MinhasCotacoes';
// Advertiser
import Advertiser from '../pages/advertiser/Advertiser';
// Advertiser: Anúncio
import CriarAnuncio from '../pages/advertiser/CriarAnuncio';
import MeusAnuncios from '../pages/advertiser/MeusAnuncios';
import MeusAnunciosList from '../pages/advertiser/MeusAnuncios/MeusAnunciosList';
import MeusAnunciosEdit from '../pages/advertiser/MeusAnuncios/MeusAnunciosEdit';
// Advertiser: Banner
import CriarBanner from '../pages/advertiser/CriarBanner';
import MeusBanners from '../pages/advertiser/MeusBanners';
import MeusBannersList from '../pages/advertiser/MeusBanners/MeusBannersList';
import MeusBannersEdit from '../pages/advertiser/MeusBanners/MeusBannersEdit';
// Admin
import Admin from '../pages/admin/Admin';
import Dashboard from '../pages/admin/Dashboard';
import NoMatch from '../pages/admin/NoMatch';
// Admin: User
import Users from '../pages/admin/Users';
import UserList from '../pages/admin/Users/UserList';
import UserCreate from '../pages/admin/Users/UserCreate';
import UserEdit from '../pages/admin/Users/UserEdit';
// Admin: Advertisements
import Advertisements from '../pages/admin/Advertisements';
import AdvertisementList from '../pages/admin/Advertisements/AdvertisementList';
import AdvertisementCreate from '../pages/admin/Advertisements/AdvertisementCreate';
import AdvertisementEdit from '../pages/admin/Advertisements/AdvertisementEdit';
// Admin: Advertisement Categories (Services)
import Categories from '../pages/admin/Categories';
import CategoryList from '../pages/admin/Categories/CategoryList';
import CategoryCreate from '../pages/admin/Categories/CategoryCreate';
import CategoryEdit from '../pages/admin/Categories/CategoryEdit';
// Admin: Locations
import Locations from '../pages/admin/Locations';
import LocationList from '../pages/admin/Locations/LocationList';
import LocationCreate from '../pages/admin/Locations/LocationCreate';
import LocationEdit from '../pages/admin/Locations/LocationEdit';
// Admin: Quotations
import Quotations from '../pages/admin/Quotations';
import QuotationList from '../pages/admin/Quotations/QuotationList';
// Admin: Articles
import Articles from '../pages/admin/Articles';
import ArticleList from '../pages/admin/Articles/ArticleList';
import ArticleCreate from '../pages/admin/Articles/ArticleCreate';
import ArticleEdit from '../pages/admin/Articles/ArticleEdit';
// Admin: Article Categories
import ArticleCategories from '../pages/admin/ArticleCategories';
import ArticleCategoryList from '../pages/admin/ArticleCategories/ArticleCategoryList';
import ArticleCategoryCreate from '../pages/admin/ArticleCategories/ArticleCategoryCreate';
import ArticleCategoryEdit from '../pages/admin/ArticleCategories/ArticleCategoryEdit';
import ArticleSubCategoryCreate from '../pages/admin/ArticleCategories/ArticleSubCategoryCreate';
import ArticleSubCategoryEdit from '../pages/admin/ArticleCategories/ArticleSubCategoryEdit';
// Admin: Banners
import Banners from '../pages/admin/Banners';
import BannerList from '../pages/admin/Banners/BannerList';
import BannerCreate from '../pages/admin/Banners/BannerCreate';
import BannerEdit from '../pages/admin/Banners/BannerEdit';

export default function MainRoutes() {
    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='dark'
            />
            <ScrollToTop />
            <Routes>
                <Route
                    path="/perfil"
                    element={
                        <RequireAuth role="all">
                            <Perfil />
                        </RequireAuth>
                    }>
                </Route>

                <Route
                    path="/minhas-cotacoes"
                    element={
                        <RequireAuth role={["engaged", "admin", "editor", "internal"]}>
                            <MinhasCotacoes />
                        </RequireAuth>
                    }>
                </Route>

                <Route
                    path='/anunciante'
                    element={
                        <RequireAuth role="advertiser">
                            <Advertiser />
                        </RequireAuth>
                    }>
                    <Route path="meus-anuncios" element={<MeusAnuncios />}>
                        <Route index element={<MeusAnunciosList />} />
                        <Route path=':id'>
                            <Route index element={<MeusAnunciosEdit />} />
                            <Route path='edit' element={<MeusAnunciosEdit />} />
                        </Route>
                    </Route>
                    <Route path="criar-anuncio" element={<CriarAnuncio />}></Route>

                    <Route path="meus-banners" element={<MeusBanners />}>
                        <Route index element={<MeusBannersList />} />
                        <Route path=':id'>
                            <Route index element={<MeusBannersEdit />} />
                            <Route path='edit' element={<MeusBannersEdit />} />
                        </Route>
                    </Route>
                    <Route path="criar-banner" element={<CriarBanner />}></Route>
                </Route>

                <Route
                    path="/admin"
                    element={
                        <RequireAuth role={["admin"]}>
                            <Admin />
                        </RequireAuth>
                    }>
                    <Route index element={<Dashboard />} />
                    <Route path='dashboard' index element={<Dashboard />} />

                    <Route path='users' element={<Users />}>
                        <Route index element={<UserList />} />
                        <Route path='create' element={<UserCreate />} />
                        <Route path=':id'>
                            <Route index element={<UserEdit />} />
                            <Route path='edit' element={<UserEdit />} />
                        </Route>
                    </Route>

                    <Route path='advertisements' element={<Advertisements />}>
                        <Route index element={<AdvertisementList />} />
                        <Route path='create' element={<AdvertisementCreate />} />
                        <Route path=':id'>
                            <Route index element={<AdvertisementEdit />} />
                            <Route path='edit' element={<AdvertisementEdit />} />
                        </Route>
                    </Route>

                    <Route path='categories' element={<Categories />}>
                        <Route index element={<CategoryList />} />
                        <Route path='create' element={<CategoryCreate />} />
                        <Route path=':id'>
                            <Route index element={<CategoryEdit />} />
                            <Route path='edit' element={<CategoryEdit />} />
                        </Route>
                    </Route>

                    <Route path='locations' element={<Locations />}>
                        <Route index element={<LocationList />} />
                        <Route path='create' element={<LocationCreate />} />
                        <Route path=':id'>
                            <Route index element={<LocationEdit />} />
                            <Route path='edit' element={<LocationEdit />} />
                        </Route>
                    </Route>

                    <Route path='quotations' element={<Quotations />}>
                        <Route index element={<QuotationList />} />
                    </Route>

                    <Route path='article-categories' element={<ArticleCategories />}>
                        <Route index element={<ArticleCategoryList />} />
                        <Route path='create' element={<ArticleCategoryCreate />} />
                        <Route path='create-sub' element={<ArticleSubCategoryCreate />} />
                        <Route path=':id'>
                            <Route index element={<ArticleCategoryEdit />} />
                            <Route path='edit' element={<ArticleCategoryEdit />} />
                            <Route path='edit-sub' element={<ArticleSubCategoryEdit />} />
                        </Route>
                    </Route>

                    <Route path='articles' element={<Articles />}>
                        <Route index element={<ArticleList />} />
                        <Route path='create' element={<ArticleCreate />} />
                        <Route path=':id'>
                            <Route index element={<ArticleEdit />} />
                            <Route path='edit' element={<ArticleEdit />} />
                        </Route>
                    </Route>

                    <Route path='banners' element={<Banners />}>
                        <Route index element={<BannerList />} />
                        <Route path='create' element={<BannerCreate />} />
                        <Route path=':id'>
                            <Route index element={<BannerEdit />} />
                            <Route path='edit' element={<BannerEdit />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NoMatch />} />
                </Route>

                <Route
                    path="/editor"
                    element={
                        <RequireAuth role={["editor"]}>
                            <Admin />
                        </RequireAuth>
                    }>
                    <Route index element={<Dashboard />} />
                    <Route path='dashboard' index element={<Dashboard />} />

                    <Route path='articles' element={<Articles />}>
                        <Route index element={<ArticleList />} />
                        <Route path='create' element={<ArticleCreate />} />
                        <Route path=':id'>
                            <Route index element={<ArticleEdit />} />
                            <Route path='edit' element={<ArticleEdit />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NoMatch />} />
                </Route>

                <Route
                    path="/internal"
                    element={
                        <RequireAuth role={["internal"]}>
                            <Admin />
                        </RequireAuth>
                    }>
                    <Route index element={<Dashboard />} />
                    <Route path='dashboard' index element={<Dashboard />} />

                    <Route path='advertisements' element={<Advertisements />}>
                        <Route index element={<AdvertisementList />} />
                        <Route path='create' element={<AdvertisementCreate />} />
                        <Route path=':id'>
                            <Route index element={<AdvertisementEdit />} />
                            <Route path='edit' element={<AdvertisementEdit />} />
                        </Route>
                    </Route>

                    <Route path='quotations' element={<Quotations />}>
                        <Route index element={<QuotationList />} />
                    </Route>

                    <Route path='banners' element={<Banners />}>
                        <Route index element={<BannerList />} />
                        <Route path='create' element={<BannerCreate />} />
                        <Route path=':id'>
                            <Route index element={<BannerEdit />} />
                            <Route path='edit' element={<BannerEdit />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NoMatch />} />
                </Route>

                <Route index path="/" element={<Home />}></Route>
                <Route path="/anuncie-aqui" element={<AnuncieAqui />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/cadastro" element={<Cadastro />}></Route>
                <Route path="/esqueci-minha-senha" element={<EsqueciMinhaSenha />}></Route>
                <Route path="/cotacao" element={<Cotacao />}></Route>
                <Route path="/materias" element={<Materias />}></Route>
                <Route path="/materias/:id" element={<Materia />}></Route>
                <Route path="/anuncios" element={<GuiaDeEmpresas />}></Route>
                <Route path="/anuncios/:id" element={<Anuncio />}></Route>
                <Route path="*" element={<NoMatchPage />} />
            </Routes>
        </>
    );
}