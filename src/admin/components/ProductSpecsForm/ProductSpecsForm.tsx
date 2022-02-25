import React from 'react';
import { Row, Form, Col, InputGroup } from 'react-bootstrap';
import { ProductWithIncludes } from '../../../shared/types';

export const ProductSpecsForm: React.FC<{
  product: ProductWithIncludes;
  onChange?: () => void;
}> = (props) => {
  const { product, onChange } = props;

  const specValues = React.useMemo(() => {
    const values: Record<number, string> = {};
    if (product?.specValues) {
      for (const val of product.specValues) {
        values[val.specPresetGroupItemId] = val.value;
      }
    }
    return values;
  }, [product?.specValues]);

  return (
    <>
      {product.specPreset?.presetGroups?.map((group) => (
        <React.Fragment key={group.id}>
          <h4>{group.name}</h4>
          {group.presetGroupItems?.map((groupItem) => (
            <React.Fragment key={groupItem.id}>
              <Row>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4}>
                    {groupItem.spec?.name}
                  </Form.Label>
                  <Col sm={8}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder=""
                        required
                        autoComplete="false"
                        value={specValues[groupItem.id] ?? ''}
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
              </Row>
            </React.Fragment>
          ))}
          <br />
        </React.Fragment>
      ))}
    </>
  );
};
