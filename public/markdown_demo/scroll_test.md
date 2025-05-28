# 滚动功能测试文档

<!-- [COMMENT]这是第一个评论，用于测试评论滚动功能。这个评论位于文档开头，应该很容易定位。 -->

这是一个用于测试滚动功能的文档。请尝试点击左侧大纲中的标题，以及右侧评论面板中的评论，查看是否能正确滚动到对应位置。

## 测试说明

本文档专门设计用来测试以下滚动场景：

1. **已在屏幕内的元素**：点击时应该居中显示，并有绿色高亮
2. **屏幕外的元素**：点击时应该滚动到合适位置，并有蓝色高亮
3. **文档底部的元素**：可能无法完全居中，但会尽量滚动并高亮
4. **评论定位**：通过上下文匹配准确定位评论位置

<!-- [COMMENT]这是第二个评论，位于测试说明部分。测试系统是否能通过前后文本准确定位到这里。 -->

## 第一个测试章节

这里是第一个测试章节的内容。这段文字应该在点击大纲中的"第一个测试章节"时滚动到视图中。

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

<!-- [COMMENT]这是第三个评论，测试在普通段落中的评论定位。系统应该能够通过周围的Lorem ipsum文本来定位。 -->

### 第一个子章节

这是一个三级标题的内容。用于测试多级标题的滚动定位。

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## 第二个测试章节

这里是第二个测试章节的内容。

<!-- [COMMENT]这是第四个评论，用于测试更复杂的定位场景。这个评论前面有标题，后面有列表。 -->

### 功能特性列表

以下是一些重要的功能特性：

- **智能滚动**：根据元素是否已在视窗内采用不同的滚动策略
- **边界处理**：正确处理文档顶部和底部的边界情况
- **视觉反馈**：提供清晰的高亮效果和位置指示
- **精确定位**：通过多种算法确保准确定位评论位置

<!-- [COMMENT]这是第五个评论，位于列表后面。测试系统是否能在列表环境中正确定位。 -->

## 第三个测试章节

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

### 代码示例

```javascript
// 这是一个代码示例
function scrollToElement(element) {
  element.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
}
```

<!-- [COMMENT]这是第六个评论，位于代码块后面。测试在代码环境附近的评论定位能力。 -->

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

## 第四个测试章节

这是一个较长的章节，用于测试滚动到文档中间位置的情况。

<!-- [COMMENT]这是第七个评论，位于文档中间位置。这里应该有足够的空间进行各种滚动操作。 -->

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.

### 表格示例

| 功能 | 描述 | 状态 |
|------|------|------|
| 大纲滚动 | 点击大纲项目滚动到对应标题 | ✅ 已实现 |
| 评论滚动 | 点击评论滚动到相关内容 | ✅ 已实现 |
| 边界处理 | 处理文档边界的滚动情况 | ✅ 已改进 |
| 视觉反馈 | 高亮显示滚动位置 | ✅ 已优化 |

<!-- [COMMENT]这是第八个评论，位于表格后面。测试在表格环境中的评论定位。 -->

Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.

## 第五个测试章节

这个章节用于测试接近文档底部的滚动行为。

<!-- [COMMENT]这是第九个评论，接近文档底部。测试系统在文档底部的滚动和定位能力。 -->

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.

### 最后的子章节

这是文档的最后一个子章节，用于测试文档底部的边界情况。

<!-- [COMMENT]这是第十个评论，位于文档最底部。这里测试边界情况下的滚动行为，可能无法完全居中显示。 -->

Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.

## 测试完成

如果您能看到这里，说明文档已经加载完成。现在可以：

1. 点击左侧大纲中的任意标题
2. 点击右侧评论面板中的任意评论
3. 观察滚动行为和高亮效果
4. 检查浏览器控制台的调试信息

期望的行为：
- 🔵 **蓝色高亮**：元素不在屏幕内，滚动后高亮
- 🟢 **绿色高亮**：元素已在屏幕内，仅高亮不滚动（或微调位置） 