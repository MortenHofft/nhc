const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

const instMap = helpers.instMap;

const manual = {
  // by looking at title matches
  "urn:uuid:46044212-8e44-42d4-b019-a5f9dbe744ad": "3d85961e-73e9-4601-adb7-a0563da97410",
  "urn:uuid:4d1be742-ff19-11e4-9eb2-002315492bbc": "4a6f1f3a-e5da-4cc1-bf9d-a5672f807c20",
  "urn:uuid:541dc52e-5702-4cac-88b9-4e4b01569392": "9eca690c-f3cf-441e-88ef-dd62f4155e09",
  "urn:uuid:677871f8-f377-11e4-b342-002315492bbc": "42b95c9b-43b0-47e3-b019-11ff50cb3e7c",
  "urn:uuid:775c950b-a9ef-4923-8a1e-89e49c2acf15": "3d85961e-73e9-4601-adb7-a0563da97410",
  "urn:uuid:78ba402f-b0b6-4655-9adc-12372ae693cf": "3d85961e-73e9-4601-adb7-a0563da97410",
  "urn:uuid:b800379a-2f8f-4ece-82b7-e66f07688a52": "9eca690c-f3cf-441e-88ef-dd62f4155e09",
  "urn:uuid:cdea3455-da68-40fc-b9ed-d70bdd8b9aad": "d2a27206-87ab-47ea-b5fc-d2e57054b688",
  "urn:uuid:cef0f6c1-11fe-44f6-ba1e-aca20cb2ce04": "ed57186b-7be4-4adc-a2d5-3d0310638e21",
  "urn:uuid:da5fc60a-fe36-4bf6-8714-6cb3747211ae": "9eca690c-f3cf-441e-88ef-dd62f4155e09",
  "urn:uuid:e095ae14-8118-4d96-ac7b-434d7733b7ab": "4a6f1f3a-e5da-4cc1-bf9d-a5672f807c20",
  "urn:uuid:e93344c2-0fc3-4e7e-ae9d-86bb37ba933b": "f9bc71e2-fe10-46c8-8448-67de06bb5d7f",
  "urn:uuid:ea55b0a7-08fe-4802-827a-88fab8f1cdea": "3d85961e-73e9-4601-adb7-a0563da97410",
  "urn:uuid:eb66c58e-5c64-4c78-80cf-2f31e7605664": "bed5c349-5b3a-4c52-bc4a-16d7297cb1af",
  "urn:uuid:ec1e54d4-02f5-44b2-9adf-2f2e655697eb": "3d85961e-73e9-4601-adb7-a0563da97410",

  //by looking at singular code matches
  "urn:uuid:013b0343-08e5-486a-9dcc-f45454536727": "acc1523d-746f-4120-823f-58fe0237f7df",
  "urn:uuid:029275c1-4b9a-4db7-a3d1-641905a5ba4e": "f25ee3d9-31d3-4c4c-82e5-7fa0a8e49097",
  "urn:uuid:0e50bbac-b0a1-4db6-bef5-017e1b4b4e66": "07bba8b3-fc1d-4983-b9de-39c13d9d1232",
  "urn:uuid:124c0f02-8c86-4945-94f3-b4ed6297f61a": "3c35744f-5766-4364-83cb-7e78d366131e",
  "urn:uuid:174e68cc-3e96-48e6-a97c-5fc42db0f6c3": "2cf6ec38-a920-4108-a2ae-a58454f51b2a",
  "urn:uuid:18316d5a-964f-4030-bdc1-e5b7886f28c8": "a372880f-52e1-4402-8254-8ff10e1f2942",
  "urn:uuid:1a7634ad-1932-4f45-8166-30d523c430ef": "07bba8b3-fc1d-4983-b9de-39c13d9d1232",
  "urn:uuid:2523c985-5ba8-4d6d-908b-db7f525582a7": "ac6141c1-c10b-4f3e-b942-6b091cc35d57",
  "urn:uuid:263bcf9c-8684-4362-b9d4-7e4e0f01848c": "13e1873c-73a7-4be6-a81c-0eef100b11eb",
  "urn:uuid:2cb1b67e-0484-11e5-b0ee-002315492bbc": "b1d74ea4-4884-45ac-8273-bdb209d1d550",
  "urn:uuid:2fcdccb5-c4c2-411e-b6e6-3684b5171143": "c8e1cb04-01ef-4804-a716-11ef204cf41b",
  "urn:uuid:32c39867-fc04-41fd-96cc-94dab1eb46a2": "c8e1cb04-01ef-4804-a716-11ef204cf41b",
  "urn:uuid:32eb5f3e-5104-426e-9d53-136e859e72ea": "661b67fd-697b-4d9e-b166-2fdf1c416364",
  "urn:uuid:34e7d983-7d1f-45f6-b332-b144109fba19": "0e5cb0d9-7feb-4bf8-b455-92f1ad3d5819",
  "urn:uuid:3e1fb67d-5b09-42c7-a64b-232c9013c6c5": "e14c227d-2864-4d0b-b555-e4933af0c69b",
  "urn:uuid:4542846f-c415-4673-9be4-de463bd55103": "78f5a8a1-97c0-479a-9d4c-f33fd15dbd54",
  "urn:uuid:45637399-b5a3-48ec-b663-f77f2290843b": "0e5cb0d9-7feb-4bf8-b455-92f1ad3d5819",
  "urn:uuid:486a41dd-ae52-4ee4-9dbb-24faa96afce6": "c8e1cb04-01ef-4804-a716-11ef204cf41b",
  "urn:uuid:4a17a44a-d0fb-4b0b-9dfc-d23da130507c": "b44a6cb2-445b-4610-8844-81521c76bd76",
  "urn:uuid:4ec0d95a-1ce0-4974-ac84-4141d5411bed": "07bba8b3-fc1d-4983-b9de-39c13d9d1232",
  "urn:uuid:51793bf4-84e9-4992-8f72-ff3cf5303589": "13e1873c-73a7-4be6-a81c-0eef100b11eb",
  "urn:uuid:54aff50c-fe2d-457b-9ce2-ad6fb6c385a3": "3c35744f-5766-4364-83cb-7e78d366131e",
  "urn:uuid:56f8490b-269b-4994-8c15-b7d52bcbd6e9": "d9ef92fc-5bdf-493c-95b0-323c794004ea",
  "urn:uuid:5fec16b8-911a-4cf4-b6fc-c8f1ea61be98": "7630ca8f-5d46-4562-a393-914ff3ee0724",
  "urn:uuid:65042982-cbce-4125-bf21-d0c5294bcc96": "878d9cc4-effa-4010-8465-8406837ef43e",
  "urn:uuid:65b981ef-3db8-4ad9-978a-463ac4a2834d": "34493984-6727-4a26-8144-4c8fef5a5c41",
  "urn:uuid:77e0f1f6-3e72-4113-ade7-7f83b4694a4d": "07bba8b3-fc1d-4983-b9de-39c13d9d1232",
  "urn:uuid:7822eea1-c6fa-4490-84a4-35d97ba32d46": "530fd4d5-732e-4b2b-b2ab-4d17ff15e8bd",
  "urn:uuid:7be6bb16-20e1-44e4-91a3-76b87ff75b6f": "1a65ac26-5c50-4edc-beab-85e23ec54837",
  "urn:uuid:7cf6be90-efb9-496a-a92a-609cc317b8fa": "b12099db-6836-49c9-8637-756b3796a13d",
  "urn:uuid:9d441784-1ecc-4cab-b959-8fe043f42cf5": "13e1873c-73a7-4be6-a81c-0eef100b11eb",
  "urn:uuid:a2fa0fba-538a-4b75-89a8-a052474d6065": "07bba8b3-fc1d-4983-b9de-39c13d9d1232",
  "urn:uuid:aa37599b-af1f-4838-ab3b-7d6c13624127": "b0587f73-d1f0-4d29-a1d9-c8911207b7d3",
  "urn:uuid:bca0e509-0a76-4c49-a89e-d7f69e2b1fd3": "1bf73e9f-8764-4c4d-9a15-41253156a745",
  "urn:uuid:c149bde9-4da2-472d-a8e9-356f7a14b488": "07bba8b3-fc1d-4983-b9de-39c13d9d1232",
  "urn:uuid:c28dc8a5-eb3b-4abf-ba7a-ea9c62204534": "3c3fc388-7da3-4363-8648-82ff5727686f",
  "urn:uuid:c5ff4683-e0a6-43b0-90a2-ee21534fbd15": "13e1873c-73a7-4be6-a81c-0eef100b11eb",
  "urn:uuid:c7e6ab6e-bbf9-47a1-9a77-ccce4678d1dd": "13e1873c-73a7-4be6-a81c-0eef100b11eb",
  "urn:uuid:ced2b1cb-3235-464e-8638-bf99f9a247ae": "13e1873c-73a7-4be6-a81c-0eef100b11eb",
  "urn:uuid:cf776df9-99bb-49b9-a106-888ffeec2924": "ef5734c8-0214-4155-a759-3cf4fd69a311",
  "urn:uuid:e08178aa-9d13-4fa5-8302-f7837fbee3fc": "40c32566-c9f6-469c-b82e-f8b3487631c3",
  "urn:uuid:e6a57218-a784-4309-9a21-8af6ae0b2fc2": "4e46c335-f199-4855-bcfe-34465057da2f",
  "urn:uuid:efc0f94c-a0d3-4327-84fa-356d57c42705": "83757286-93dc-4279-9db8-63f946ee8b6f",
  "urn:uuid:fa4976e4-2cd0-4649-94da-6b162f7c9f52": "07bba8b3-fc1d-4983-b9de-39c13d9d1232",
  "urn:uuid:ff15207e-3181-4296-b10f-7d963c1595c1": "4145c2b8-cb94-4c6f-b595-3d58bfcf883a",

  // titles, filtered in active and matched to the active one
  "urn:uuid:2633de7d-17a1-462c-8e6e-4f5e35520e67": "6e3f900f-0118-43b1-a4a7-b1febc263602",
  "urn:uuid:32333d5e-e4f1-488e-b771-90a37998d6f8": "6e3f900f-0118-43b1-a4a7-b1febc263602",
  "urn:uuid:d208db4b-eb06-4c2a-af5f-fb1655dbd3c4": "6e3f900f-0118-43b1-a4a7-b1febc263602",

  // titles, chosen a match based on the most similar code among good alternatives
  "urn:uuid:127d8714-f28e-492e-a3b5-4a43a339e861": "0e5cb0d9-7feb-4bf8-b455-92f1ad3d5819",
  "urn:uuid:150000b6-4490-4130-ad82-134b4db63f13": "472b6282-eaeb-43f0-b860-7845a66985a5",
  "urn:uuid:245ac2a1-af6b-4664-b804-2a5e7c70c227": "0e5cb0d9-7feb-4bf8-b455-92f1ad3d5819",
  "urn:uuid:4714e1c2-856d-4334-b7d6-47314577c480": "0e5cb0d9-7feb-4bf8-b455-92f1ad3d5819",
  "urn:uuid:a7ab062e-0121-4760-a7d1-3948bede73ca": "0dba35aa-8440-4733-a40e-284b764e49e7",
  "urn:uuid:c49c2cf8-c0bc-4186-9299-770b6e1615fd": "423b960d-3cae-4112-bac1-b7add4b4be6b",
  "urn:uuid:cb47a591-0a5f-4fe0-9487-691aad029fa0": "586ee56e-b0fe-4dff-b7f9-aeb104f3308a",

  // same city 7 words matching
  "urn:uuid:d420aeaf-88cf-4b19-9575-ecc8f4c858f3": "60aaba9b-3c42-402f-ab54-32a2fc54d571",
  // same city 6 words matching
  "urn:uuid:db8c793d-75f3-4663-b3db-2d2f6a79f5db": "a6b3e261-fead-4a79-9fc0-90b00ebf47e0",
  // same city 5 words matching
  "urn:uuid:88121228-b58f-4313-a859-c06e06174589": "d74cfc02-d3f2-43a9-9f64-e372c52eeb33",
  "urn:uuid:8f452d58-efe5-4979-8739-324a68f6f13d": "d74cfc02-d3f2-43a9-9f64-e372c52eeb33",
  "urn:uuid:a52f3e7e-58f2-40b8-9110-5f54db89f4d6": "60aaba9b-3c42-402f-ab54-32a2fc54d571",
  "urn:uuid:c38dc04f-171e-4342-9a42-a152f6661184": "d74cfc02-d3f2-43a9-9f64-e372c52eeb33",
  // same city 4 words matching
  "urn:uuid:01c1679e-1b2f-4a6f-bb7e-4ba6a41ee92b": "67f0a9dc-5cdd-4d7f-8afb-eb1fbf6bf58f",
  "urn:uuid:24a9fb44-0484-11e5-b0ee-002315492bbc": "8962f5eb-19af-4d5a-a9ff-58d210870ba8",
  "urn:uuid:26ab6b80-62a7-4473-82c6-44822e439886": "6351bb40-7b2c-4bff-b5de-89b2757fe475",
  "urn:uuid:2740580b-64d2-476b-9392-99e35d0b04e2": "c0bc8f75-f56c-4d2e-b417-030b365d0b32",
  "urn:uuid:3039e541-9f97-4a39-b0d1-d9accd3a598d": "cda4c7e7-f88e-4c55-9b1c-cd56614a6677",
  "urn:uuid:31197cfd-ae35-49f4-88d5-bc9dbe7e31fe": "c0bc8f75-f56c-4d2e-b417-030b365d0b32",
  "urn:uuid:42b66f53-c979-48db-b099-8fc822b075b7": "f93c8044-ccc4-4ed2-b8b2-03df238b7be1",
  "urn:uuid:43257b72-b2df-4656-b2ca-94739b26023b": "1290f0dd-c604-44a3-9e56-4e517db53a53",
  "urn:uuid:449fe71f-5513-4fff-855b-d7f1de581621": "c0bc8f75-f56c-4d2e-b417-030b365d0b32",
  "urn:uuid:48d4edb3-4843-4b71-8ee4-cb7434d8b951": "75cb2553-500c-481c-89dc-3c5df7996621",
  "urn:uuid:4a6dc5e3-8a52-4708-a856-8c7a12633ada": "6351bb40-7b2c-4bff-b5de-89b2757fe475",
  "urn:uuid:4faa5d83-2ca0-42ef-8504-c10f3595e270": "6351bb40-7b2c-4bff-b5de-89b2757fe475",
  "urn:uuid:56910bcf-180c-4040-99f1-34943f8bbf47": "6351bb40-7b2c-4bff-b5de-89b2757fe475",
  "urn:uuid:61db23c3-7bad-4e7d-877f-ce13cca8e6f9": "6c68ab5f-4a9b-483a-bd9e-3917bab76981",
  "urn:uuid:6fbfdf50-a16a-4e69-8116-4cb19aef9cc7": "6c68ab5f-4a9b-483a-bd9e-3917bab76981",
  "urn:uuid:7cafb10e-fd9e-4701-9583-1ce71b66e995": "6c68ab5f-4a9b-483a-bd9e-3917bab76981",
  "urn:uuid:a9a9f7df-3920-467b-b436-e5430302233a": "6351bb40-7b2c-4bff-b5de-89b2757fe475",
  "urn:uuid:b45b427a-5f5e-4e47-8fee-c10259f28801": "ff9e52d6-7dc2-42d9-a5d4-3352ff31461f",
  "urn:uuid:b4c68450-551d-41f0-804f-3eed951e7297": "6c68ab5f-4a9b-483a-bd9e-3917bab76981",
  "urn:uuid:c23a6c9e-bc67-4a51-930b-c0e31f685959": "d56badc1-4729-449e-8d30-8b75fe1439a3",
  "urn:uuid:e12f8140-588b-4d85-8012-0cde0e716163": "6c68ab5f-4a9b-483a-bd9e-3917bab76981",
  "urn:uuid:f2f50ab7-ac4a-430e-9c15-7e389a4bffdf": "4692b97c-010f-49ad-8845-f2bd5097fd9b",
  "urn:uuid:fece0396-afcb-424c-b1ce-7302aaa11a52": "6351bb40-7b2c-4bff-b5de-89b2757fe475",
  // same city 3 words matching
  "urn:uuid:046cee40-7617-4971-8580-e5784d88ef13": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:0c8ef729-0c5b-4ca3-8957-a70f232eee7d": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:10b24bf2-1ef6-4e2f-85dc-d6c2f4a66b39": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:19bef62c-4c3c-4c93-80b8-2d5c68bc6646": "75cb2553-500c-481c-89dc-3c5df7996621",
  "urn:uuid:2178c211-a5da-463b-9289-097811de02c0": "1702fd4d-174f-4e47-adfa-a85d6d674e22",
  "urn:uuid:2d1ff123-90ea-49b8-80d9-c92799c33f6d": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:314e040e-e59f-45f0-b1a0-fb02e7d84f16": "44c2b14c-c62c-461f-b55c-84acc7944ccd",
  "urn:uuid:324ad8fe-a4ea-42cc-8657-8483a151f277": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:3f10f691-99da-4e74-9a7d-d97a1322ac0e": "953b2d19-fb56-4a51-a4de-c71ed850caab",
  "urn:uuid:4727e230-406f-4572-8ffe-246186e3bbaf": "44c2b14c-c62c-461f-b55c-84acc7944ccd",
  "urn:uuid:47ab203c-035e-49c4-a23f-a95e31a498f9": "da10b17a-3f12-482e-ba92-4f58104c7ddd",
  "urn:uuid:4b65ca29-2764-4552-adc9-9f2431b5f6fb": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:4d36794a-8bff-4196-90cb-dffd97756c4e": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:5556df49-4bce-470b-94c3-207eb0f4004f": "44c2b14c-c62c-461f-b55c-84acc7944ccd",
  "urn:uuid:625a32d1-3a10-4e3b-b149-d0078d68f1b9": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:75b674ec-f983-43c1-8829-5238f8a611ac": "80d7c7c7-d7d1-4139-9e6b-a5586d7f6bf9",
  "urn:uuid:79e6a1e5-c65f-439d-bfed-94b15946480e": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:7bf1eb60-183d-448b-8d2e-bc769f31c622": "e7b62d2b-1060-4193-9c84-5aa9cfa666ad",
  "urn:uuid:803c5a29-6bd0-4a71-a399-36b68decc757": "dfe8ac92-f33b-4646-a7eb-fae94e5a3a37",
  "urn:uuid:84348a09-ffc3-4cc3-827e-e8863f753214": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:9d0dbefd-4f50-443d-8298-1e528b04c117": "80d7c7c7-d7d1-4139-9e6b-a5586d7f6bf9",
  "urn:uuid:a2f0e394-f706-436c-8a6c-604af6c59b8b": "96536dfb-3bec-4d66-95b1-61649f34c31a",
  "urn:uuid:a57efbe1-b115-404d-8872-5726ff645c0c": "80d7c7c7-d7d1-4139-9e6b-a5586d7f6bf9",
  "urn:uuid:abc0ac43-365d-4c46-9abc-fa81526ec121": "e8fc05d2-bc78-494b-b962-e55b347a1d3d",
  "urn:uuid:b46c1e6c-21a6-4fc6-9788-fa68f8ba0ed2": "96536dfb-3bec-4d66-95b1-61649f34c31a",
  "urn:uuid:b8b4ddba-06d4-44ad-ad66-ef9274a496ea": "d09d24db-a842-4b89-86c6-b89c212df55d",
  "urn:uuid:b91328bf-7dca-401e-bd0f-8f7f5d652778": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:c4030961-4f4a-4e85-acda-3ba29807b6d7": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:c45b8e0a-b11c-4c58-a4c9-58594250a5b2": "ffeda1d0-be10-464c-8811-1d1db1dac2d0",
  "urn:uuid:c6ca4f0a-fa19-47ee-82af-405b6278aeff": "22334861-afca-4dc7-ae70-e1f70542dab1",
  "urn:uuid:ccad9b4d-b62e-4706-8336-eea796e81f57": "44c2b14c-c62c-461f-b55c-84acc7944ccd",
  "urn:uuid:cd29d4c8-7f71-4b11-9457-e9d751f99f8c": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:d10068ea-0d8e-42ce-be14-1f9f44babcf3": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:d1f3185c-e0e6-4cb4-af38-0e1376a78e2e": "44c2b14c-c62c-461f-b55c-84acc7944ccd",
  "urn:uuid:d5e548d4-e8a7-43fd-be9d-68afb7e41bb3": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:ed26928d-9307-4b11-993c-c20927cf5228": "530c45d0-e0f7-401d-b3f6-34f58482c485",
  "urn:uuid:f2c6d379-7c90-47ed-96a7-59e0ac3348e0": "96536dfb-3bec-4d66-95b1-61649f34c31a",
  "urn:uuid:fd598a71-f628-4400-8904-eed3d545b91e": "6f4be27d-2e5b-4cfa-a761-e80a5e3cc4be",
  "urn:uuid:fedb3d10-f9a2-465e-b36b-6891dc35658b": "44c2b14c-c62c-461f-b55c-84acc7944ccd",
  "urn:uuid:fefa9f88-5b44-44df-8462-2e0ac7472c4d": "96f1a3e5-f438-4c39-8c13-ef0d12afd837",
}



function start(reporting){
  const idig = require('../data/titleManualMatches.json');
  let count = 0;
  //get matches by identifiers
  idig.forEach(r => {
    if (r._grbioInstMatch) {
      return;
    }
    const match = manual[r.collection_uuid];
    const inst = instMap[match];
    if (match) {
      count++;
      r._grbioInstMatch = match;
      r._matchReason = 'MANUAL';
      if (reporting) {
        log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
        log('GRBIO  :  ', chalk.blue((inst._code + '').padEnd(10)), chalk.blue(inst.name));
        log();
      }
    }
  });

  log(chalk.blue(Object.keys(manual).length + ' are manually mapped in the list'));
  log(chalk.blue(count + ' was not already matched and got matched manually'));
  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  helpers.saveJson(idig, './idigbio/data/manualMatches.json');
}

module.exports = start;