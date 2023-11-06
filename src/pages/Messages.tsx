import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';

import MessageItem, {MessageItemSeparator} from '../components/MessageItem';
import untypedMessages from '../dummy/messages.json';
import {MessageType} from '../types';

// Tab: User
// Messages: 訊息列表頁面
export default function Messages() {
  const messages = untypedMessages as MessageType[];

  const renderItem: ListRenderItem<MessageType> = ({item}) => {
    return <MessageItem message={item} />;
  };

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      ItemSeparatorComponent={MessageItemSeparator}
    />
  );
}
