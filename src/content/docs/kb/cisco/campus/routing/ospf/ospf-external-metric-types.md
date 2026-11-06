---
title: OSPF External Metric Types
status: draft
version: 0.0.1
---

When an external route is redistributed into OSPF, it becomes an external route, which can be designated as either type 1 ([E1](https://www.google.com/search?cs=1&sca_esv=ddf9d82acd96d665&sxsrf=AE3TifNDbBKMAoBXHTasTtLqGf6na_3zgw%3A1759053378443&q=E1&sa=X&ved=2ahUKEwiay-y9mPuPAxUa9AIHHXkVFiMQxccNegQIExAB&mstk=AUtExfDtR_0_52QDYSRVhRgqZbyAIbDT-SV9m021wNVhy7xJdVrj-oLeRw7Hf1TPLo9NKUsnbYa6LTitlVC22t51CFest2CBYTNdgij5tbV_1a_SKkxxvf2xWFS0QVXecROliZcAsu-hj-OkacXid3MKNbAkyPw3y8N8CcnI5x5EeoaC2UQ&csui=3)) or type 2 ([E2](https://www.google.com/search?cs=1&sca_esv=ddf9d82acd96d665&sxsrf=AE3TifNDbBKMAoBXHTasTtLqGf6na_3zgw%3A1759053378443&q=E2&sa=X&ved=2ahUKEwiay-y9mPuPAxUa9AIHHXkVFiMQxccNegQIExAC&mstk=AUtExfDtR_0_52QDYSRVhRgqZbyAIbDT-SV9m021wNVhy7xJdVrj-oLeRw7Hf1TPLo9NKUsnbYa6LTitlVC22t51CFest2CBYTNdgij5tbV_1a_SKkxxvf2xWFS0QVXecROliZcAsu-hj-OkacXid3MKNbAkyPw3y8N8CcnI5x5EeoaC2UQ&csui=3)). 

- Metric Type E1 (External Type 1):   
	- The cost of an E1 route is the sum of the external cost (the seed metric set at the ASBR) and the internal OSPF cost to reach that ASBR.
	- This means the cost to reach the external destination is cumulative, with each internal link to the ASBR being factored into the path selection.
    - Use Case: E1 routes are useful when you want OSPF to find the best overall path, considering both the cost to the gateway to the external network and the internal network links.
    
- Metric Type E2 (External Type 2):
    - The cost of an E2 route is fixed and only includes the external cost, ignoring the internal cost to reach the ASBR.
    - Every OSPF router in the domain will see the same metric cost for the external network, regardless of their distance to the ASBR.
    - Use Case: E2 routes are often used in active/passive setups where you want a primary exit point to always be preferred. By setting a higher, fixed seed metric on a secondary ASBR, the E2 metric will ensure the primary exit is always chosen.
