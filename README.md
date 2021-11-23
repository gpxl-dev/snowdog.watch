# snowdog.watch

## What does it do?

[snowdog.watch](https://snowdog.watch) calculates the result of a buyback transaction (or the first of several transactions) for [the snowdog token](https://www.snowdogdao.com/). It is important to note what the result actually means:

1. **Number of tokens burned** - this is the number of tokens that need to be removed from the [SDOG-MIM TradeJoe liquidity pool](https://snowtrace.io/address/0xa3f1f5076499ec37d5bb095551f85ab5a344bb58) in order to satisfy the constant product AMM equation (more on this below). Put differently, this is the number of tokens that the MIM value of the treasury would buy from the AMM pool. These tokens will be burned by the SDOG team.
2. **Spot price after buyback** - this is the amount of MIM you would have to pay _per SDOG_ to remove an infinitessimally small amout of SDOG from the SDOG-MIM pool after the buyback. By their very nature, constant product AMM pools move the price with every single buy - there's a spot price before your buy, and a spot price after your buy, but you never actually _pay_ the exact spot price because you're always changing the price as a result of the transaction. In realitiy, the price you pay is somewhere between the two figures.

## How does it do it?

1. Fetch the reserves from the Trader Joe pool - this tells us how much MIM and SDOG are _currently_ in the pool - we use this ratio to calculate the current spot price of SDOG to display.
2. Get the balance of each of the tokens in the treasury (excluding the SDOG-MIM which is not used for the buyback)
3. Calculate the value in MIM of each of the treasury tokens using the ratio of reserves in [TOKEN]-AVAX pool to get the price in AVAX, then the AVAX-MIM pool to get the price in MIM.
4. Combine the total value of all of the tokens in the treasury to get the amount of MIM that will be added to the SDOG-MIM pool when the buyback occurs.
5. Use the AMM constant product formula to work out how many SDOG tokens will be removed from the pool as a result of adding the amount of MIM from the treasury
6. Use the resulting ratio of SDOG to MIM tokens to calculate the spot price after the buyback.

## What's the AMM constant product fomula?

Automated market makers forked from uniswap use a "constant product" formula to determine how many of token B you can buy with token A. The formula is incredibly simple:

```bash
(number of A tokens) * (number of B tokens) = constant
```

As such, if you are adding `X` A tokens to the pool, the number you will receive back (`Y`) can be calculated as follows:

```bash
(A + X) * (B - Y) = k
            B - Y = k / (A + X)
              - Y = k / (A + X) - B
                Y = B - k / (A + X)
```

Example with numbers:

```bash
# Initial reserves 10,000,000 MIM and 5,000 SDOG
A = 10,000,000     B = 5,000

initial price of SDOG = 10,000,000 / 5,000 = 2,000 MIM

# Invariant product (constant)
k = 10,000,000 * 5,000 = 50,000,000,000

# Buy SDOG with 1,000,000 MIM:
X = 1,000,000

# Plugging numbers into the formula above
(10,000,000 + 1,000,000) * (5,000 - Y) = 50,000,000,000

# Using the simplification above:
Y = 5,000 - (50,000,000,000 / 11,000,000)

Y = 454.545455 SDOG received

# Final reserves:
A = 11,000,000     B = (5,000 - 454.545433) = 4,545.454545

final price of SDOG = 11,000,000 /  4,545.454545 = 2,420 MIM
```

You can see from the above example, that given the contents of 10M MIM and 5K SDOG, 1M MIM would buy ~454 SDOG, and would move the price to 2,420 MIM.

The spot price before was 2,000 MIM, and the spot price after increased to 2,420 MIM. This difference is known as **price impact** - in this case it was +21%. **NOTE**, though, that we didn't actually pay either of these two prices for the SDOG that we purchased. We received 454 SDOG for 1M MIM, this is approx 2,200 MIM per SDOG, which is between the two.

## Frequently asked questions

#### The price of SDOG is $2k, and the value of the treasury is $50M. 50M / 2k = 25k, so how come the burn isn't 25,000 SDOG?

See the formula and worked example above. The TL;DR: is that the "price" on an AMM is only a theoretical spot price for an infinitessimally small amount of the token you're buying. As the amount of tokens you're putting in (the size of your buy order) increases, the price you'll receive will move move further from the spot price you'll get. If your buy is significant compared with the value of liquidity in the pool, this difference will be big.

#### What happens if there isn't enough liquidity for (or after) the buyback?

"Not enough liquidity" isn't really a thing with AMMs unless the pool is completely empty. Otherwise there's always an order (AMM = automated **market maker** - always makes orders). Greater liquidity in the pool means it's harder to move the price. The SDOG treasury owns >99.5% of the liquidity in the Trader Joe SDOG MIM pool at the time of writing, and they won't pull this.

#### Will the buyback be one transaction or multiple transactions?

🤷

#### What happens after the buyback?

If I knew this I'd be rich. What we do know is that [Snowbank DAO now owns >10k SDOG](https://snowtrace.io/tx/0xfe6890f1ab660e7bc5badf0ff71e099623208b53e597509fa0f1dff2ca8c4dc6). Make of that what you will.

## Limitations

- Fees not considered - each Trader Joe transaction has a 0.3% fee - shouldn't impact the numbers too much.
- I haven't considered price impact when selling off treasury assets - I expect that the team will not sell off (e.g.) all of their AVAX in one go, so hopefully this should have a minimal impact on the final treasury value.
