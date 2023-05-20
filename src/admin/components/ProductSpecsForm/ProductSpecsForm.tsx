import React from 'react';
import { Row, Form, Col, InputGroup } from 'react-bootstrap';
import { ProductWithIncludes } from '../../../shared/types';

export const ProductSpecsForm: React.FC<{
  productData: ProductWithIncludes;
  onChange?: () => void;
}> = (props) => {
  const { productData: productData, onChange } = props;

  const specValues = React.useMemo(() => {
    const values: Record<number, string> = {};
    if (productData?.specValues) {
      for (const val of productData.specValues) {
        values[val.specPresetGroupItemId] = val.value;
      }
    }
    return values;
  }, [productData?.specValues]);

  return (
    <>
      {productData.specPreset?.presetGroups?.map((group) => (
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
                        defaultValue={specValues[groupItem.id] ?? ''}
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
