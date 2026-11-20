#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify real horse identity and authorised intake evidence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصان ضمن إجراء «تسجيل بيانات الحصان الأساسية ومراجعة هويته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Search existing horse IDs identifiers and names before creating. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** ابحث عن الحصان ضمن إجراء «تسجيل بيانات الحصان الأساسية ومراجعة هويته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Enter bilingual identity breed birth date and identifier as supported. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن التاريخ ضمن إجراء «تسجيل بيانات الحصان الأساسية ومراجعة هويته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Read back profile and avoid importing demo facts. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «تسجيل بيانات الحصان الأساسية ومراجعة هويته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Horses workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Owner is linked account; rest/retired block new riding; care completion is not clearance. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified horses record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Owner is linked account; rest/retired block new riding; care completion is not clearance. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 5, 8, 14, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-08, DEC-10, DEC-20, DEC-24 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### HOR-002 — Assign/change horse owner and assigned instructor; verify private visibility

**العنوان العربي:** تعيين مالك الحصان ومدربه والتحقق من خصوصية بياناته

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: HOR-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Stable manager/admin | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: HOR-001, HOR-003, HOR-004, HOR-005, HOR-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: assign/change horse owner and assigned instructor; verify private visibility, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تعيين مالك الحصان ومدربه والتحقق من خصوصية بياناته» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Horses workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تعيين مالك الحصان ومدربه والتحقق من خصوصية بياناته» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تعيين مالك الحصان ومدربه والتحقق من خصوصية بياناته»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Stable manager/admin; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Horses Add/Edit/Delete; document upload Horses Add and removal Horses Delete; owner read exception.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Identify horse and intended owner by stable account ID in same academy. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الحصان والحساب ضمن إجراء «تعيين مالك الحصان ومدربه ومراجعة خصوصية بياناته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Confirm owner membership and authorised assignment. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «تعيين مالك الحصان ومدربه ومراجعة خصوصية بياناته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Set owner and assigned instructor through horse record. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن الحصان والمدرب المكلّف والمدرب ضمن إجراء «تعيين مالك الحصان ومدربه ومراجعة خصوصية بياناته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify owned-horse visibility without granting general horse access. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصان ضمن إجراء «تعيين مالك الحصان ومدربه ومراجعة خصوصية بياناته»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Horses workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Owner is linked account; rest/retired block new riding; care completion is not clearance. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified horses record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Owner is linked account; rest/retired block new riding; care completion is not clearance. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 5, 8, 14, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-08, DEC-10, DEC-20, DEC-24 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### HOR-003 — Apply rest/retired status and process authorised return to ready

**العنوان العربي:** تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: HOR-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Veterinary/horse-care authority | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: HOR-001, HOR-002, HOR-004, HOR-005, HOR-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: apply rest/retired status and process authorised return to ready, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Horses workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Veterinary/horse-care authority; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Horses Add/Edit/Delete; document upload Horses Add and removal Horses Delete; owner read exception.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify current horse status and documented clinical restriction. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع حالة الحصان والحصان والمستند ضمن إجراء «تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. لا ترفع قيود الراحة دون تصريح مهني معتمد. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Apply rest or retired status through authorised horse edit. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** حدّث الحصان ضمن إجراء «تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. لا ترفع قيود الراحة دون تصريح مهني معتمد. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Review existing affected bookings for human follow-up. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز ضمن إجراء «تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Return to ready only after approved clinical clearance and explicit authorised status update. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** حدّث التاريخ ضمن إجراء «تسجيل الراحة أو التقاعد وإعادة الحصان إلى الجاهزية بموافقة مختصة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Horses workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Owner is linked account; rest/retired block new riding; care completion is not clearance. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified horses record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Owner is linked account; rest/retired block new riding; care completion is not clearance. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 5, 8, 14, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-08, DEC-10, DEC-20, DEC-24 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### HOR-005 — Upload, verify, classify, replace/remove and retrieve horse documents

**العنوان العربي:** رفع مستندات الخيل وتصنيفها والتحقق منها واستبدالها أو حذفها

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: HOR-005 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Horse-care admin | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: HOR-001, HOR-002, HOR-003, HOR-004, HOR-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: upload, verify, classify, replace/remove and retrieve horse documents, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «رفع مستندات الخيل وتصنيفها والتحقق منها واستبدالها أو حذفها» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Horses workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «رفع مستندات الخيل وتصنيفها والتحقق منها واستبدالها أو حذفها» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «رفع مستندات الخيل وتصنيفها والتحقق منها واستبدالها أو حذفها»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Horse-care admin; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Horses Add/Edit/Delete; document upload Horses Add and removal Horses Delete; owner read exception.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify horse ID and provenance of passport vaccination medical or ownership file. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصان ضمن إجراء «رفع مستندات الخيل وتصنيفها ومراجعةها واستبدالها أو حذفها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Upload PDF PNG or JPEG up to 2 MB with category and bilingual title. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أرفق البيانات ذات الصلة ضمن إجراء «رفع مستندات الخيل وتصنيفها ومراجعةها واستبدالها أو حذفها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Open downloaded attachment and verify authorised owner/staff visibility. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «رفع مستندات الخيل وتصنيفها ومراجعةها واستبدالها أو حذفها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Record replacement/removal with version provenance and permission check. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الصلاحية والسجل ضمن إجراء «رفع مستندات الخيل وتصنيفها ومراجعةها واستبدالها أو حذفها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Horses workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Documents accept PDF, PNG or JPEG up to 2 MB; upload and delete use different grants. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified horses record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Owner is linked account; rest/retired block new riding; care completion is not clearance. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 5, 8, 14, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-08, DEC-10, DEC-20, DEC-24 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### PRC-001 — Approve and maintain price plans and categories

**العنوان العربي:** اعتماد خطط الأسعار وفئات الخدمات وتحديثها

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: PRC-001 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Finance/management | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: PRC-002, PRC-003, PRC-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: approve and maintain price plans and categories, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «اعتماد خطط الأسعار وفئات الخدمات وتحديثها» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Pricing and promotions workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «اعتماد خطط الأسعار وفئات الخدمات وتحديثها» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «اعتماد خطط الأسعار وفئات الخدمات وتحديثها»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Finance/management; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Pricing Add/Edit/Delete or Discounts/Vouchers grant as applicable.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Obtain approved price category amount and SAR terms. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «اعتماد خطط الأسعار وفئات الخدمات وتحديثها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Create or edit correct active plan under Pricing permissions. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أنشئ الصلاحية ضمن إجراء «اعتماد خطط الأسعار وفئات الخدمات وتحديثها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Check booking versus boarding eligibility and existing financial snapshots. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز والإيواء ضمن إجراء «اعتماد خطط الأسعار وفئات الخدمات وتحديثها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Read back saved values and record approval. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن السجل والموافقة ضمن إجراء «اعتماد خطط الأسعار وفئات الخدمات وتحديثها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Pricing and promotions workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Approved tariffs only; package quantity is positive; existing invoice snapshots remain. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified pricing and promotions record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Approved tariffs only; package quantity is positive; existing invoice snapshots remain. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§5, 9, 11, 12, 13, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-11, DEC-13, DEC-14, DEC-15 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### PRC-002 — Configure package quantities and verify saved values/snapshots

**العنوان العربي:** ضبط عدد الحصص في الباقات والتحقق من القيم المحفوظة

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: PRC-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Finance/admin | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: PRC-001, PRC-003, PRC-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: configure package quantities and verify saved values/snapshots, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «ضبط عدد الحصص في الباقات والتحقق من القيم المحفوظة» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Pricing and promotions workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «ضبط عدد الحصص في الباقات والتحقق من القيم المحفوظة» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «ضبط عدد الحصص في الباقات والتحقق من القيم المحفوظة»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Finance/admin; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Pricing Add/Edit/Delete or Discounts/Vouchers grant as applicable.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Choose lesson package category before setting positive session quantity. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** اختر الحصة والباقة ضمن إجراء «ضبط عدد الحصص في الباقات ومراجعة القيم المحفوظة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Save price and quantity then reopen to verify persistence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «ضبط عدد الحصص في الباقات ومراجعة القيم المحفوظة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Confirm existing invoices keep historical snapshots. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الفاتورة ضمن إجراء «ضبط عدد الحصص في الباقات ومراجعة القيم المحفوظة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. طبّق قيود تعديل المهام وفق التاريخ المحلي لمدينة الرياض. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Do not award credits until full external settlement. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الخارجي ورصيد الحصص ضمن إجراء «ضبط عدد الحصص في الباقات ومراجعة القيم المحفوظة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Pricing and promotions workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Approved tariffs only; package quantity is positive; existing invoice snapshots remain. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified pricing and promotions record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Approved tariffs only; package quantity is positive; existing invoice snapshots remain. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§5, 9, 11, 12, 13, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-11, DEC-13, DEC-14, DEC-15 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### PRC-004 — Issue, protect, redeem and reconcile monetary vouchers

**العنوان العربي:** إصدار القسائم المالية وحمايتها واستخدامها وتسويتها

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: PRC-004 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Finance/member services | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: PRC-001, PRC-002, PRC-003.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: issue, protect, redeem and reconcile monetary vouchers, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إصدار القسائم المالية وحمايتها واستخدامها وتسويتها» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Pricing and promotions workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إصدار القسائم المالية وحمايتها واستخدامها وتسويتها» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إصدار القسائم المالية وحمايتها واستخدامها وتسويتها»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Finance/member services; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Pricing Add/Edit/Delete or Discounts/Vouchers grant as applicable.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Approve and issue monetary voucher with unique protected code. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أنشئ البيانات ذات الصلة ضمن إجراء «إصدار القسائم المالية وحمايتها واستخدامها وتسويتها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Record initial value expiry and intended recipient in approved evidence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن السجل ضمن إجراء «إصدار القسائم المالية وحمايتها واستخدامها وتسويتها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Apply only to eligible monetary quote after discount. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «إصدار القسائم المالية وحمايتها واستخدامها وتسويتها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify partial redemption and restoration on eligible cancellation or hold expiry. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «إصدار القسائم المالية وحمايتها واستخدامها وتسويتها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Pricing and promotions workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Approved tariffs only; package quantity is positive; existing invoice snapshots remain. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified pricing and promotions record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Approved tariffs only; package quantity is positive; existing invoice snapshots remain. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§5, 9, 11, 12, 13, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-11, DEC-13, DEC-14, DEC-15 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SCH-001 — Create a future session with approved instructor, horse and location

**العنوان العربي:** إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SCH-001 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Scheduling | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SCH-002, SCH-003, SCH-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: create a future session with approved instructor, horse and location, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Scheduling workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Scheduling; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Classes/Bookings Add or Edit; relevant resource reads.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify instructor horse ready status arena price and approved future date. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصان والمدرب والتاريخ ضمن إجراء «إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Create opening with start/end capacity roster and credit cost. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أنشئ البيانات ذات الصلة ضمن إجراء «إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Resolve resource rider feeding-window and booking conflicts. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الموارد المتاحة والحجز والتغذية ضمن إجراء «إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Read back saved opening and member-facing availability. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.
