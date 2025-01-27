import { GroupedItems } from './groupedItems';
import { ITEM_TYPE } from 'constants/customizationVariables';

class GroupedTools extends GroupedItems {
  constructor(props) {
    const { dataElement, items, headerDirection, gap } = props;
    super(props);
    this.dataElement = dataElement;
    this.type = ITEM_TYPE.GROUPED_TOOLS;
    this.items = items;
    this.headerDirection = headerDirection;
    this._gap = gap;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new GroupedTools(propsWithStore);
};