import {ItemListRendererProps} from '../typeahead/types';

import MentionsItemRenderer from './MentionsItemRenderer';
import './styles.css';
import {TeamMember} from './types';

export default function MentionsItemListRenderer({
  items,
  popupRef,
  selectedItem,
  selectItem,
}: ItemListRendererProps<TeamMember>) {
  return (
    <div className="mentions-popup" ref={popupRef}>
      {items.map((item, index) => (
        <MentionsItemRenderer
          key={index}
          isSelected={selectedItem === items[index]}
          item={item as TeamMember}
          selectItem={selectItem}
        />
      ))}
    </div>
  );
}