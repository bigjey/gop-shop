import "./CategoriesScreen.css";

import React, { useEffect } from "react";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router";
import { deleteCategory, getCategoriesTree } from "../../api/categories";
import classNames from "classnames";
import { CategoriesOptions } from "../../components/CategoryOptions";

export const CategoriesScreen: React.FC = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isMounted, setMounted] = React.useState<Boolean>(false);
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  const [deleteType, setDeleteType] = React.useState<"all" | "move">("all");
  const [deleteCategoryPrompt, setDeleteCategoryPrompt] =
    React.useState<Category>();

  const newParentIdRef = React.useRef<HTMLSelectElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMounted && location.state === "reload") {
      setIsLoading(true);
      getCategoriesTree().then((data) => {
        setCategories(data as Category[]);
        setIsLoading(false);
      });
    }
  }, [isMounted, location.state, location.key]);

  useEffect(() => {
    setMounted(true);
    if (location.state !== "reload") {
      setIsLoading(true);
      getCategoriesTree().then((data) => {
        setCategories(data as Category[]);
        setIsLoading(false);
      });
    }
  }, []);

  const onDeleteClick = React.useCallback((category: Category) => {
    if (category.children?.length) {
      setDeleteCategoryPrompt(category);
    } else {
      if (confirm(`Delete "${category.name}"?`)) {
        deleteCategory(category.id)
          .then(() => {
            navigate("", {
              replace: true,
              state: "reload",
            });
          })
          .catch(() => {
            alert("Could not delete this category");
          });
      }
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
                  <Categories items={categories} onDelete={onDeleteClick} />
                </div>
              ) : (
                <div>No Categories yet</div>
              )}
            </div>
          )}
          <Outlet />
        </Container>
      </div>
      {deleteCategoryPrompt ? (
        <Modal
          show
          centered
          size="lg"
          onHide={() => {
            setDeleteCategoryPrompt(undefined);
          }}
        >
          <Modal.Body>
            <h4>Category "{deleteCategoryPrompt.name}" has children</h4>
            <p>Please select how you wanna deal with it's children</p>
            <hr />
            <Form>
              <Form.Group>
                <Form.Check
                  name="deleteType"
                  type={"radio"}
                  label="Delete all children categories"
                  id="all"
                  checked={deleteType === "all"}
                  onChange={() => setDeleteType("all")}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Check
                  name="deleteType"
                  type={"radio"}
                  label="Move children categories to another category"
                  id="move"
                  checked={deleteType === "move"}
                  onChange={() => setDeleteType("move")}
                />
                <Form.Select
                  aria-label="Select Category"
                  id="parentId"
                  name="parentId"
                  ref={newParentIdRef}
                >
                  <option value={""}>No parent (root)</option>
                  <CategoriesOptions
                    items={categories}
                    exclude={[deleteCategoryPrompt.id]}
                  />
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              size="lg"
              onClick={() => {
                if (deleteType === "all") {
                  deleteCategory(deleteCategoryPrompt.id).then(() => {
                    alert("deleted");
                  });
                } else {
                  const deleteOptions: DeleteOptions = {
                    type: deleteType,
                    newParentId: newParentIdRef.current?.value
                      ? Number(newParentIdRef.current.value)
                      : null,
                  };
                  deleteCategory(deleteCategoryPrompt.id, deleteOptions).then(
                    () => {
                      alert("deleted");
                    }
                  );
                }
              }}
            >
              Delete "{deleteCategoryPrompt.name}"
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

const Categories: React.FC<{
  items: Category[];
  level?: number;
  onDelete(category: Category): void;
}> = ({ items, level = 0, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div>
      {items.map((item) => (
        <React.Fragment key={item.name}>
          <div
            className={classNames(["categories-tree__item"], {
              "categories-tree__item--inactive": !item.isActive,
            })}
            style={{ marginLeft: level * 30, maxWidth: 600 }}
          >
            <Row style={{ alignItems: "center" }}>
              <Col xs={12} lg={true}>
                {item.name}{" "}
                {!item.isActive && (
                  <div className="categories-tree__inactive-label">
                    inactive
                  </div>
                )}
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
                      onDelete(item);
                    }}
                  >
                    delete
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          {item.children && item.children.length > 0 && (
            <Categories
              items={item.children}
              level={level + 1}
              onDelete={onDelete}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
