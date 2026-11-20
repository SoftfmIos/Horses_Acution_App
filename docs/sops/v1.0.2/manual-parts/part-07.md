**AR:** الغرض من هذا الإجراء هو «إعداد خطط تغذية خاصة بكل حصان ومواعيد تنفيذها» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Feeding workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إعداد خطط تغذية خاصة بكل حصان ومواعيد تنفيذها» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إعداد خطط تغذية خاصة بكل حصان ومواعيد تنفيذها»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Horse-care authority; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Feeding Add/Edit for plans; Tasks/Feeding Edit for occurrence completion.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify horse-specific approved feed quantity unit and timing. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصان ضمن إجراء «إعداد خطط تغذية خاصة بكل حصان ومواعيد تنفيذها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Create plan with dates assignee and optional inventory linkage. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أنشئ المخزون والتاريخ ضمن إجراء «إعداد خطط تغذية خاصة بكل حصان ومواعيد تنفيذها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Check feeding windows and conflicts with riding bookings. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز والتغذية ضمن إجراء «إعداد خطط تغذية خاصة بكل حصان ومواعيد تنفيذها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Review generated occurrences within rolling 28-day window and read back. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «إعداد خطط تغذية خاصة بكل حصان ومواعيد تنفيذها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Feeding workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Feeding task generation rolls 28 days ahead; do not assume all future tasks exist. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified feeding record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Horse-specific approved rations; rolling 28-day occurrences; stock consumed on completion once. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§14, 15, 16, 17, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-08, DEC-09, DEC-17 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### FEED-002 — Execute feeding and record actual completion/exceptions

**العنوان العربي:** تنفيذ التغذية وتوثيقها والإبلاغ عن الاستثناءات

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: FEED-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Assigned care staff | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: FEED-001, FEED-003.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: execute feeding and record actual completion/exceptions, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تنفيذ التغذية وتوثيقها والإبلاغ عن الاستثناءات» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Feeding workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تنفيذ التغذية وتوثيقها والإبلاغ عن الاستثناءات» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تنفيذ التغذية وتوثيقها والإبلاغ عن الاستثناءات»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Assigned care staff; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Feeding Add/Edit for plans; Tasks/Feeding Edit for occurrence completion.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify assigned horse occurrence and authorised ration before physical feeding. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصان والتغذية ضمن إجراء «تنفيذ التغذية وإثباتها والإبلاغ عن الاستثناءات»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Perform activity and verify feed item/unit/expiry where linked. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «تنفيذ التغذية وإثباتها والإبلاغ عن الاستثناءات»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Record completion once and check actual actor/time and stock effect. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المخزون والسجل ضمن إجراء «تنفيذ التغذية وإثباتها والإبلاغ عن الاستثناءات»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Escalate missed feed shortage or discrepancy without false completion. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** صعّد البيانات ذات الصلة ضمن إجراء «تنفيذ التغذية وإثباتها والإبلاغ عن الاستثناءات»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Feeding workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Horse-specific approved rations; rolling 28-day occurrences; stock consumed on completion once. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified feeding record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Horse-specific approved rations; rolling 28-day occurrences; stock consumed on completion once. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§14, 15, 16, 17, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-08, DEC-09, DEC-17 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### FEED-003 — Link feeding plans to correct stock units and check availability

**العنوان العربي:** ربط خطط التغذية بوحدات المخزون الصحيحة والتحقق من توفرها

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: FEED-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Care/stores supervisor | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: FEED-001, FEED-002.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: link feeding plans to correct stock units and check availability, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «ربط خطط التغذية بوحدات المخزون الصحيحة والتحقق من توفرها» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Feeding workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «ربط خطط التغذية بوحدات المخزون الصحيحة والتحقق من توفرها» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «ربط خطط التغذية بوحدات المخزون الصحيحة والتحقق من توفرها»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Care/stores supervisor; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Feeding Add/Edit for plans; Tasks/Feeding Edit for occurrence completion.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Identify approved feed inventory item and integer stock unit. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من المخزون ضمن إجراء «ربط خطط التغذية بوحدات المخزون الصحيحة ومراجعة توفرها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Match plan consumption quantity to stock measurement. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من المخزون ضمن إجراء «ربط خطط التغذية بوحدات المخزون الصحيحة ومراجعة توفرها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Check current/forecast stock and expiry before linking. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المخزون ضمن إجراء «ربط خطط التغذية بوحدات المخزون الصحيحة ومراجعة توفرها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify completion consumes stock once and do not change referenced units. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المخزون والمرجع ضمن إجراء «ربط خطط التغذية بوحدات المخزون الصحيحة ومراجعة توفرها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Feeding workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Horse-specific approved rations; rolling 28-day occurrences; stock consumed on completion once. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified feeding record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Horse-specific approved rations; rolling 28-day occurrences; stock consumed on completion once. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§14, 15, 16, 17, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-08, DEC-09, DEC-17 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### TASK-002 — Complete an occurrence accurately and retain actor/time evidence

**العنوان العربي:** توثيق إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: TASK-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Authorised performer | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: TASK-001, TASK-003, TASK-004, TASK-005.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: complete an occurrence accurately and retain actor/time evidence, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «توثيق إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Staff tasks workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «توثيق إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «توثيق إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Authorised performer; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Tasks/Feeding/Medical Edit as relevant; administrator for older-than-yesterday corrections.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify correct task occurrence due date and real performance. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المهمة والتاريخ ضمن إجراء «إثبات إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Check module Edit permission and Riyadh historical boundary. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الصلاحية ضمن إجراء «إثبات إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. طبّق قيود تعديل المهام وفق التاريخ المحلي لمدينة الرياض. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Complete once and confirm actor/time and linked stock effect. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المخزون ضمن إجراء «إثبات إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Stop on cancelled work or failed stock validation. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من المخزون ضمن إجراء «إثبات إكمال المهمة مع اسم المنفذ وتوقيت التنفيذ»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Staff tasks workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Riyadh-date historical lock; completed work must be real; reopening reverses original stock movement. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified staff tasks record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Riyadh-date historical lock; completed work must be real; reopening reverses original stock movement. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§15, 16, 17, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-03, DEC-08, DEC-09, DEC-23 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### TASK-003 — Reopen/correct an occurrence and verify stock reversal

**العنوان العربي:** إعادة فتح المهمة أو تصحيحها والتحقق من عكس حركة المخزون

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: TASK-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Supervisor/authorised staff | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: TASK-001, TASK-002, TASK-004, TASK-005.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: reopen/correct an occurrence and verify stock reversal, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إعادة فتح المهمة أو تصحيحها والتحقق من عكس حركة المخزون» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Staff tasks workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إعادة فتح المهمة أو تصحيحها والتحقق من عكس حركة المخزون» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إعادة فتح المهمة أو تصحيحها والتحقق من عكس حركة المخزون»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Supervisor/authorised staff; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Tasks/Feeding/Medical Edit as relevant; administrator for older-than-yesterday corrections.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify occurrence and documented correction reason. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المستند ضمن إجراء «إعادة فتح المهمة أو تصحيحها ومراجعة عكس حركة المخزون»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Check Riyadh date and Edit/admin authority. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع التاريخ ضمن إجراء «إعادة فتح المهمة أو تصحيحها ومراجعة عكس حركة المخزون»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Reopen once and verify original stock consumption is reversed. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المخزون ضمن إجراء «إعادة فتح المهمة أو تصحيحها ومراجعة عكس حركة المخزون»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Retain original completion and correction history. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «إعادة فتح المهمة أو تصحيحها ومراجعة عكس حركة المخزون»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Staff tasks workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Riyadh-date historical lock; completed work must be real; reopening reverses original stock movement. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified staff tasks record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Riyadh-date historical lock; completed work must be real; reopening reverses original stock movement. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§15, 16, 17, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-03, DEC-08, DEC-09, DEC-23 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### TASK-004 — Administrator correction of work older than yesterday

**العنوان العربي:** تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: TASK-004 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: System admin/supervisor | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: TASK-001, TASK-002, TASK-003, TASK-005.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: administrator correction of work older than yesterday, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Staff tasks workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: System admin/supervisor; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Tasks/Feeding/Medical Edit as relevant; administrator for older-than-yesterday corrections.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Identify task older than yesterday by Asia/Riyadh civil date. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من المهمة والتاريخ ضمن إجراء «تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. طبّق قيود تعديل المهام وفق التاريخ المحلي لمدينة الرياض. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Escalate with evidence to system administrator. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** صعّد البيانات ذات الصلة ضمن إجراء «تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Perform authorised correction without altering due date to evade lock. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** نفّذ التاريخ ضمن إجراء «تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify history and any stock reversal or new consumption. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المخزون ضمن إجراء «تصحيح المهام الأقدم من يوم أمس بواسطة مسؤول النظام»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Staff tasks workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: On Thursday, Tuesday is older than yesterday and requires administrator; Wednesday may be edited by authorised ordinary staff. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified staff tasks record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Riyadh-date historical lock; completed work must be real; reopening reverses original stock movement. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§15, 16, 17, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-03, DEC-08, DEC-09, DEC-23 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### INV-001 — Create inventory items with controlled units/opening stock

**العنوان العربي:** إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: INV-001 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Stores | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: INV-002, INV-003, INV-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: create inventory items with controlled units/opening stock, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Inventory workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Stores; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Inventory Add for receipts/items; Edit for authorised adjustments.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Approve inventory item name unit reorder threshold and opening quantity. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** احصل على الموافقة المطلوبة بشأن المخزون قبل المتابعة في إجراء «إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية». تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Check duplicate items and feed-plan dependencies. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Create item with Inventory Add permission. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أنشئ المخزون والصلاحية ضمن إجراء «إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify quantity and record any opening movement evidence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع السجل ضمن إجراء «إنشاء أصناف المخزون مع ضبط الوحدات والأرصدة الافتتاحية»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Inventory workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Physical stock is authoritative for count verification; expiry/shortage can block feeding completion. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified inventory record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Physical stock is authoritative for count verification; expiry/shortage can block feeding completion. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§15, 17, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-09, DEC-17 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### INV-002 — Record delivery receipts and supporting references

**العنوان العربي:** تسجيل استلام المواد وإثباتات التسليم

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: INV-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Stores/finance | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: INV-001, INV-003, INV-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: record delivery receipts and supporting references, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تسجيل استلام المواد وإثباتات التسليم» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Inventory workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تسجيل استلام المواد وإثباتات التسليم» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تسجيل استلام المواد وإثباتات التسليم»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Stores/finance; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Inventory Add for receipts/items; Edit for authorised adjustments.