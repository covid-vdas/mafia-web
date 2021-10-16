import Header from './header'
import PropTypes from 'prop-types'

const Layout = ({ children }) => {
    return <>
        <Header />
        <main>
            <div className="container">
                {children}
            </div>
        </main>
        <style jsx>{`
            main {
                min-height     : 100vh;
                padding        : 0 0.5rem;
                display        : flex;
                flex-direction : column;
                justify-content: center;
                align-items    : center;
                height         : 100vh;
            }
            main > div {
                padding        : 5rem 0;
                flex           : 1;
                display        : flex;
                flex-direction : column;
                justify-content: center;
                align-items    : center;
            }
        `}</style>
    </>
}

export default Layout

Layout.propTypes = {
    children: PropTypes.node,
}