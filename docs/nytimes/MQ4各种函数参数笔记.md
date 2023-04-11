# MQ4函数解析笔记

## 关闭订单的函数`OrderClosePrice()`
详细解释一下 MarketInfo(OrderSymbol(), MODE_BID) MarketInfo(OrderSymbol(), MODE_ASK) 、ask 、bid、与`OrderClosePrice()`  并解释用哪一个关掉订单最合适?

MarketInfo(OrderSymbol(), MODE_BID) 和 MarketInfo(OrderSymbol(), MODE_ASK) 是用来获取当前交易品种的买入价和卖出价的函数。其中，MODE_BID 表示买入价，MODE_ASK 表示卖出价。买入价指的是交易商愿意以该价格买入货币对的最高价格，卖出价指的是交易商愿意以该价格卖出货币对的最低价格。这两个价格之间的差距称为价差（或者叫做点差），是交易商的盈利来源之一。

OrderClosePrice() 是用来获取已经关闭的订单的平仓价格的函数。当我们使用 OrderClose() 函数来关闭一个订单时，可以通过 OrderClosePrice() 函数来获取该订单的平仓价格。

如果我们想要关闭一个买单，那么应该使用卖出价来计算平仓价格，因为卖出价比买入价更接近当前市场价格，而卖出价也是交易商愿意以该价格卖出货币对的最低价格。因此，在关闭买单时，应该使用 MarketInfo(OrderSymbol(), MODE_ASK) 来获取卖出价，并将其作为平仓价格。

同理，如果我们想要关闭一个卖单，那么应该使用买入价来计算平仓价格，因为买入价比卖出价更接近当前市场价格，而买入价也是交易商愿意以该价格买入货币对的最高价格。因此，在关闭卖单时，应该使用 MarketInfo(OrderSymbol(), MODE_BID) 来获取买入价，并将其作为平仓价格。

直接使用内置函数`OrderClosePrice()`作为关闭订单的依据，程序会自动判断用Ask还是Bid，无需手动或使用条件语句判断。

## 设置止盈和止损

``` c++
// 计算止损和止盈
double SL = 0;
double TP = 0;

if(OrderType() == OP_BUY)
{
    SL = Ask - stopLoss * Point;
    TP = Ask + takeProfit * Point;
}
else if(OrderType() == OP_SELL)
{
    SL = Bid + stopLoss * Point;
    TP = Bid - takeProfit * Point;
}
```
代码放在策略中需要计算止损和止盈水平的地方。如果希望在每个新的tick到来时重新计算止损和止盈水平，那么可以将其放在`ontick()`函数中。如果只希望在开仓时计算一次，那么可以将其放在全局中。

## 下单的函数及写法

```
 int BuyTicket = OrderSend(Symbol(), OP_BUYLIMIT, CurrentBuyLotSize, BuyLimitPrice, 3, 0, 0, "WinLimit-Buy", MagicNumber, 0, clrGreen);
 int SellTicket = OrderSend(Symbol(), OP_SELLLIMIT, CurrentSellLotSize, SellLimitPrice, 3, 0, 0, "WinLimit-Sell", MagicNumber, 0, clrRed);
```
上面这段代码是用来在MetaTrader 4平台上下限价买卖单的。`OrderSend`函数的各个参数的意义如下：

- `Symbol()`：交易品种，这里使用当前图表的交易品种。
- `OP_BUYLIMIT`：订单类型，这里是限价买单。
- `CurrentBuyLotSize`：交易手数。
- `BuyLimitPrice`：限价买单的价格。
- `3`：止损和止盈的距离，以点为单位。这里设置为3点。
- `0`：止损价格。这里设置为0，表示不设止损。
- `0`：止盈价格。这里设置为0，表示不设止盈。
- `"WinLimit-Buy"`：订单注释。
- `MagicNumber`：订单魔数，用于区分不同的策略或EA产生的订单。
- `0`：挂单过期时间。这里设置为0，表示挂单不会过期。
- `clrGreen`：订单在图表上显示的颜色。

如何要设置止盈和止损 要改动3后面两个0的位置为 `SL` `TP`

## for循环的迷惑

`for(int i = OrdersTotal() - 1; i >= 0; i--)与 for(int i = 0; i < OrdersTotal(); i++)`

这两个`for`循环的区别在于它们遍历订单的顺序不同。

- `for(int i = OrdersTotal() - 1; i >= 0; i--)`：这个循环是从最后一个订单开始，倒序遍历所有订单。
- `for(int i = 0; i < OrdersTotal(); i++)`：这个循环是从第一个订单开始，顺序遍历所有订单。

在某些情况下，遍历订单的顺序可能会影响策略的执行。例如，如果你在循环中删除了某个订单，那么使用倒序遍历可以避免因为订单索引改变而导致的问题。

### 为什么在定义删除所有订单closeAllOder()时，必须使用for(int i = OrdersTotal() - 1; i >= 0; i--) 

在定义删除所有订单的`closeAllOrder()`函数时，通常会使用`for(int i = OrdersTotal() - 1; i >= 0; i--)`这种倒序遍历的方式，原因是当你删除一个订单时，`OrdersTotal()`的值会减少1，而且所有订单的索引也会发生变化。

如果你使用顺序遍历的方式，那么在删除一个订单后，下一个订单的索引会变成当前订单的索引，这样就会导致漏删订单。而使用倒序遍历的方式则不会出现这个问题，因为删除一个订单只会影响它后面的订单的索引，而不会影响它前面的订单。

举个例子，假设你有3个订单，它们的索引分别为0、1和2。如果你使用顺序遍历的方式，在删除索引为0的订单后，原本索引为1和2的订单现在变成了索引为0和1的订单。这样，在下一次循环中，你会跳过原本索引为1的订单，直接删除索引为1（原本为2）的订单。而如果你使用倒序遍历的方式，在删除索引为2的订单后，原本索引为0和1的订单仍然是索引为0和1，不会受到影响。

> 在大多数情况下，使用`for(int i = 0; i < OrdersTotal(); i++)`顺序遍历和使用`for(int i = OrdersTotal() - 1; i >= 0; i--)`倒序遍历都是可以的。只有在你需要对订单进行删除或修改操作时，才需要注意遍历的顺序。
> 如果只是想获取订单信息，而不需要对订单进行删除或修改操作，那么使用顺序遍历和倒序遍历都是可以的。例如，可以使用顺序遍历来统计当前所有订单的总盈亏。
