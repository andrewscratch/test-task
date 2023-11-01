import React, { useEffect, useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
const DummyList = React.lazy(() => import("./tabs/DummyList.jsx"));
const DummyChart = React.lazy(() => import("./tabs/DummyChart.jsx"));
const DummyTable = React.lazy(() => import("./tabs/DummyTable.jsx"));

const componentsMap = {
  "tabs/DummyList.jsx": DummyList,
  "tabs/DummyChart.jsx": DummyChart,
  "tabs/DummyTable.jsx": DummyTable,
};

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
`;

const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  align-items: center;
  text-decoration: none;
  color: #333;
  margin: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

function App() {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    fetch("/tabs.json")
      .then((response) => response.json())
      .then((data) => {
        setTabs(data.sort((a, b) => a.order - b.order));
      });
  }, []);

  return (
    <Router>
      <CenteredWrapper>
        <div>
          <Nav>
            {tabs.map((tab) => (
              <StyledLink key={tab.id} to={`/${tab.id}`}>
                {tab.title}
              </StyledLink>
            ))}
          </Nav>

          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {tabs.map((tab) => (
                <Route
                  key={tab.id}
                  path={`/${tab.id}`}
                  element={<TabComponent path={tab.path} />}
                />
              ))}
              <Route
                path="*"
                element={<Navigate to={`/${tabs[0]?.id}`} replace />}
              />
            </Routes>
          </Suspense>
        </div>
      </CenteredWrapper>
    </Router>
  );
}

const TabComponent = ({ path }) => {
  const Component = componentsMap[path];
  if (!Component) return <div>Component not found</div>;

  return <Component />;
};

export default App;
