import "./CategoriesScreen.css";

import React, { useEffect } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getCategories } from "../../mocks";

export const CategoriesScreen: React.FC = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isMounted, setMounted] = React.useState<Boolean>(false);
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMounted && location.state === "reload") {
      setIsLoading(true);
      getCategories().then((data) => {
        setCategories(data as Category[]);
        setIsLoading(false);
      });
    }
  }, [isMounted, location.state, location.key]);

  useEffect(() => {
    setMounted(true);
    if (location.state !== "reload") {
      setIsLoading(true);
      getCategories().then((data) => {
        setCategories(data as Category[]);
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <>
      <div className="app-content-title">
        <Container>
          <h1>Manage Categories</h1>
        </Container>
      </div>
      <div className="app-content-controls">
        <Container>
          <Row>
            <Col style={{ flexGrow: 0 }}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="Search Categories"
                  size="lg"
                  style={{ width: 300 }}
                />
              </Form.Group>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Button
                size="lg"
                onClick={() => {
                  navigate("add");
                }}
              >
                Add Category
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="app-content-body">
        {isLoading && <>loading</>}
        <Container>
          {!isLoading && (
            <div>
              {categories.length ? (
                <div className="categories-tree">
                  <Categories items={categories} />
                </div>
              ) : (
                <div>No Categories yet</div>
              )}
            </div>
          )}
          <Outlet />
        </Container>
      </div>
    </>
  );
};

const Categories: React.FC<{ items: Category[]; level?: number }> = ({
  items,
  level = 0,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {items.map((item) => (
        <React.Fragment key={item.name}>
          <div
            className="categories-tree__item"
            style={{ marginLeft: level * 30, maxWidth: 600 }}
          >
            <Row style={{ alignItems: "center" }}>
              <Col xs={12} lg={true}>
                {item.name}
              </Col>
              <Col xs={12} lg={true} style={{ textAlign: "right" }}>
                <div className="categories-tree__controls">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      navigate(`edit/${item.id}`);
                    }}
                  >
                    edit
                  </Button>{" "}
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      navigate("", {
                        replace: true,
                        state: "reload",
                      });
                    }}
                  >
                    delete
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          {item.children && item.children.length > 0 && (
            <Categories items={item.children} level={level + 1} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
