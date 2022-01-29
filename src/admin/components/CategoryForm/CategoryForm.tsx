import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import {
  createCategory,
  editCategory,
  getCategories,
  getCategory,
} from "../../mocks";
import * as Yup from "yup";

type CategoryFormProps = {
  mode?: "edit" | "create";
};

export const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [error, setError] = useState<any>(null);

  const formRef = React.useRef<HTMLFormElement>(null);

  const { mode = "create" } = props;

  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const { id } = params;

  const wrongMode = mode === "edit" && !id;

  if (wrongMode) {
    console.error("wtf");
  }

  const title = mode === "create" ? "New Category" : "Edit category";

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      getCategories(),
      mode === "edit" && id ? getCategory(Number(id)) : null,
    ])
      .then(([categories, category]) => {
        setCategories(categories as Category[]);

        if (category) {
          setCategory(category as Category);
        }
      })
      .catch((e) => {
        console.log(e);
        console.log("ololo", e);
        setError(e.toString());
      })
      .finally(() => {
        console.log("???");
        setIsLoading(false);
      });
  }, []);

  const formik = useFormik<CategoryFormValue>({
    enableReinitialize: true,
    initialValues: {
      isActive: true,
      name: "",
      parentId: null,
      sortOrder: 0,
      ...category,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (mode === "edit") {
        return editCategory(Number(id), values)
          .then(() => {
            navigate("/categories", { state: "reload" });
          })
          .catch(() => {
            console.log("error");
          });
      } else {
        return createCategory(values)
          .then(() => {
            navigate("/categories", { state: "reload" });
          })
          .catch(() => {
            console.log("error");
          });
      }
    },
  });

  console.log(isLoading);

  return (
    <Modal
      show
      centered
      size="lg"
      onHide={() => {
        navigate("/categories");
      }}
    >
      {isLoading && <div>loading</div>}

      {error && <>{JSON.stringify(error, null, 2)}</>}

      {!isLoading && !error && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit} ref={formRef}>
              <Form.Group
                as={Row}
                className="mb-3"
                style={{ alignItems: "center" }}
              >
                <Form.Label column sm={2} htmlFor="isActive">
                  Active
                </Form.Label>
                <Col sm={10}>
                  <Form.Check
                    id="isActive"
                    name="isActive"
                    type="switch"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2} htmlFor="name">
                  Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    placeholder=""
                    required
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2} htmlFor="parentId">
                  Parent
                </Form.Label>
                <Col sm={10}>
                  <Form.Select
                    aria-label="Select Category"
                    id="parentId"
                    name="parentId"
                    onChange={formik.handleChange}
                    value={formik.values.parentId || undefined}
                  >
                    <option value={""}>No parent (root)</option>
                    <CategoriesOptions items={categories} />
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2} htmlFor="sortOrder">
                  Sort Order
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Sort Order"
                    id="sortOrder"
                    name="sortOrder"
                    value={formik.values.sortOrder}
                    onChange={formik.handleChange}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                formik.submitForm();
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

const CategoriesOptions: React.FC<{ items?: Category[]; level?: number }> = (
  props
) => {
  const { items, level = 0 } = props;

  if (!items) {
    return null;
  }

  return (
    <>
      {items.map((c) => (
        <React.Fragment key={c.id}>
          <option value={c.id} className={`level-${level}`}>
            {"".padStart(level * 3, "   ")} {c.name}
          </option>
          <CategoriesOptions items={c.children} level={level + 1} />
        </React.Fragment>
      ))}
    </>
  );
};
