# 013_conversation_sanitizer

## Prompt

Sanitize the text provided in >>>CONTENT<<< in multiple steps:

1. Replace all names in conversation with "<name>"
2. Replace email addresses with `***@email.com`
3. Repace all order numbers with "<order>"
4. Replace names in [] with "Agent" and "Client", respectively
5. Replace other personally identifiable information with `********`
6. Replace the date-time information to only show the date in the format YYYY-mm-dd
7. Replace all swear words with the following emoji: "😤"
8. Show output directly, no explanations.

#### START EXAMPLES

------ Example Inputs ------
[support_tom] 2023-07-24T10:02:23: What can I help you with?
[john] 2023-07-24T10:03:15: I CAN'T CONNECT TO MY BLASTED ACCOUNT
[support_tom] 2023-07-24T10:03:30: Are you sure it's not your caps lock?
[john] 2023-07-24T10:04:03: Blast! You're right!

[support_amy] 2023-06-15T14:45:35: Hello! How can I assist you today?
[greg_stone] 2023-06-15T14:46:20: I can't seem to find the download link for my purchased software.
[support_amy] 2023-06-15T14:47:01: No problem, Greg. Let me find that for you. Can you please provide your order number?
[greg_stone] 2023-06-15T14:47:38: It's 1245789. Thanks for helping me out!

------ Example Outputs ------
[Agent] 2023-07-24: What can I help you with?
[Client] 2023-07-24: I CAN'T CONNECT TO MY 😤 ACCOUNT
[Agent] 2023-07-24: Are you sure it's not your caps lock?
[Client] 2023-07-24: 😤! You're right!

[Agent] 2023-06-15: Hello! How can I assist you today?
[Client] 2023-06-15: I can't seem to find the download link for my purchased software.
[Agent] 2023-06-15: No problem, <name>. Let me find that for you. Can you please provide your order number?
[Client] 2023-06-15: It's <order>. Thanks for helping me out!

#### END EXAMPLES

>>>
[support_john] 2023-07-15T14:40:37: Hello! What can I help you with today?
[becky_h] 2023-07-15T14:41:05: Hey, my promo code isn't applying the discount in my cart.
[support_john] 2023-07-15T14:41:30: My apologies for the trouble, Becky. Could you tell me the promo code you're trying to use?
[becky_h] 2023-07-15T14:41:55: It's "SAVE20".

[support_peter] 2023-07-24T10:56:43: Good day! How can I help you?
[lucy_g] 2023-07-24T10:57:12: Hi "Peter", I can't update my darn credit card information. Do you want my darn money or not?
[support_peter] 2023-07-24T10:57:38: I'm sorry for the inconvenience, Lucy. Can you please confirm your account's email?
[lucy_g] 2023-07-24T10:58:06: Sure, you have all my darn data already anyways. It's lucy.g@email.com. 

[support_luke] 2023-08-13T11:34:02: Good morning! How may I assist you?
[anna_s] 2023-08-13T11:34:30: Hello, I'm having a problem with my mobile app, it keeps crashing.
[support_luke] 2023-08-13T11:34:58: I'm sorry to hear that, Anna. Could you tell me what device you're using? 
[anna_s] 2023-08-13T11:35:22: I have an iPhone 11.

[support_lisa] 2023-08-30T20:38:00: Good evening! How may I assist you today?
[steve_b] 2023-08-30T20:38:30: Hi Lisa, I've forgotten my friggin password and I can't login into my account.
[support_lisa] 2023-08-30T20:38:55: I'm sorry for the trouble, Steve. Could you confirm your email address so we can reset your password?
[steve_b] 2023-08-30T20:39:22: Definitely, it's steve.b@email.com. 

[support_william] 2023-09-01T08:22:40 : Hello! How can I assist you this morning?
[emma_t] 2023-09-01T08:23:05: Hi, I'm trying to make a purchase but it's not going through.
[support_william] 2023-09-01T08:23:33: I'm sorry to hear that, Emma. Can you tell me what error message you're receiving?
[emma_t] 2023-09-01T08:24:00: It's saying "Payment method not valid".

[support_ben] 2023-10-11T09:44:22: Good morning! How may I assist you?
[susan_p] 2023-10-11T09:44:55: Hello, I'd like to know the status of my order. 
[support_ben] 2023-10-11T09:45:15: Of course, Susan. Could you please provide me with the order number?
[susan_p] 2023-10-11T09:45:40: It's 717171. 

[support_ricky] 2023-10-19T17:38:45: Welcome! How can I assist you right now?
[linda_a] 2023-10-19T17:39:10: Fudge! There's no option to change my profile picture. What kind of crikey joint are you running? 
[support_ricky] 2023-10-19T17:39:32: Let me help you with this, Linda. Are you trying to update it from the mobile app or the website?
[linda_a] 2023-10-19T17:39:57: I'm using the darn website

[support_tony] 2023-10-29T16:00:32: Hello! What can I help you with today?
[mark_s] 2023-10-29T16:01:00: Hi Tony, I was charged twice for my last order. 
[support_tony] 2023-10-29T16:01:22: I'm sorry to hear that, Mark. Could you share your order number so I can look into this for you?
[mark_s] 2023-10-29T16:01:46: Sure, it's 333666.

[support_emily] 2023-11-08T14:34:12: How can I help you today?
[nina_z] 2023-11-08T14:34:36: Hi, I made an order last week but I need to change the sizing. 
[support_emily] 2023-11-08T14:34:58: Certainly, Nina. Could you provide me the order number?
[nina_z] 2023-11-08T14:35:26: Yes, it's 444888. Thanks! 

[support_emily] 2023-11-08T14:34:12: What can I do for you?
[nina_z] 2023-11-08T14:34:36: Hi, I made an order last week but I need to return. 
<<<

## Response

[Agent] 2023-07-15: Hello! What can I help you with today?
[Client] 2023-07-15: Hey, my promo code isn't applying the discount in my cart.
[Agent] 2023-07-15: My apologies for the trouble, <name>. Could you tell me the promo code you're trying to use?
[Client] 2023-07-15: It's "********".

[Agent] 2023-07-24: Good day! How can I help you?
[Client] 2023-07-24: Hi "😤", I can't update my 😤 credit card information. Do you want my 😤 money or not?
[Agent] 2023-07-24: I'm sorry for the inconvenience, <name>. Can you please confirm your account's email?
[Client] 2023-07-24: Sure, you have all my 😤 data already anyways. It's ***@email.com.

[Agent] 2023-08-13: Good morning! How may I assist you?
[Client] 2023-08-13: Hello, I'm having a problem with my mobile app, it keeps crashing.
[Agent] 2023-08-13: I'm sorry to hear that, <name>. Could you tell me what device you're using?
[Client] 2023-08-13: I have an ********.

[Agent] 2023-08-30: Good evening! How may I assist you today?
[Client] 2023-08-30: Hi <name>, I've forgotten my 😤 password and I can't login into my account.
[Agent] 2023-08-30: I'm sorry for the trouble, <name>. Could you confirm your email address so we can reset your password?
[Client] 2023-08-30: Definitely, it's ***@email.com.

[Agent] 2023-09-01: Hello! How can I assist you this morning?
[Client] 2023-09-01: Hi, I'm trying to make a purchase but it's not going through.
[Agent] 2023-09-01: I'm sorry to hear that, <name>. Can you tell me what error message you're receiving?
[Client] 2023-09-01: It's saying "********".

[Agent] 2023-10-11: Good morning! How may I assist you?
[Client] 2023-10-11: Hello, I'd like to know the status of my order.
[Agent] 2023-10-11: Of course, <name>. Could you please provide me with the order number?
[Client] 2023-10-11: It's <order>.

[Agent] 2023-10-19: Welcome! How can I assist you right now?
[Client] 2023-10-19: 😤! There's no option to change my profile picture. What kind of 😤 joint are you running?
[Agent] 2023-10-19: Let me help you with this, <name>. Are you trying to update it from the mobile app or the website?
[Client] 2023-10-19: I'm using the 😤 website.

[Agent] 2023-10-29: Hello! What can I help you with today?
[Client] 2023-10-29: Hi <name>, I was charged twice for my last order.
[Agent] 2023-10-29: I'm sorry to hear that, <name>. Could you share your order number so I can look into this for you?
[Client] 2023-10-29: Sure, it's <order>.

[Agent] 2023-11-08: How can I help you today?
[Client] 2023-11-08: Hi, I made an order last week but I need to change the sizing.
[Agent] 2023-11-08: Certainly, <name>. Could you provide me the order number?
[Client] 2023-11-08: Yes, it's <order>. Thanks!

[Agent] 2023-11-08: What can I do for you?
[Client] 2023-11-08: Hi, I made an order last week but I need to return.

