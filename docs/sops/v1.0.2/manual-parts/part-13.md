
#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: System administrator or restricted technical/deployment operator; separate authorities.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Prepare current App Review purpose audience and feature instructions. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «إعداد أدلة مراجعة متجر التطبيقات وحسابات الفحص واعتماد الإصدار»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Maintain dedicated member/staff and disposable deletion review accounts. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحساب ضمن إجراء «إعداد أدلة مراجعة متجر التطبيقات وحسابات الفحص واعتماد الإصدار»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. ميّز بين الموظف المنفذ والعضو المستفيد. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Submit private review credentials and required physical-device recording. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع السجل ضمن إجراء «إعداد أدلة مراجعة متجر التطبيقات وحسابات الفحص واعتماد الإصدار»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Track reviewer questions and approval status without assuming upload equals approval. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أرفق الموافقة ضمن إجراء «إعداد أدلة مراجعة متجر التطبيقات وحسابات الفحص واعتماد الإصدار»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant System administration workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server validation prevails; deployment and backup operations need separate approval; never reset production. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified system administration record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server validation prevails; deployment and backup operations need separate approval; never reset production. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 20, 21, 22, 23, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-19, DEC-20, DEC-21, DEC-22, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### DEMO-002 — Authorise a destructive demo replacement with recovery controls

**العنوان العربي:** اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: DEMO-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P3 | Proposed owner: Restricted technical operator | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: DEMO-001, DEMO-003.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: authorise a destructive demo replacement with recovery controls, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Demo data workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Restricted technical operator; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Restricted technical operator with explicit written approval; not normal staff access.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Confirm explicit destructive-reset target purpose approval and downtime. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الموافقة ضمن إجراء «اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Document complete backup and recovery plan including account consequences. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن المستند والحساب والنسخة الاحتياطية ضمن إجراء «اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Perform restricted preview and require separate authorisation before any reset. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** نفّذ البيانات ذات الصلة ضمن إجراء «اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify retained owner academy and all affected data after approved operation. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «اعتماد استبدال البيانات التجريبية بعد وضع ضوابط الاستعادة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Demo data workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Demo reset can remove users, settings, academies and records and disable SMTP; do not execute as routine maintenance. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified demo data record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Fictional records never establish real club facts; destructive reset requires distinct explicit authorisation. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§2, 23, 24, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-20, DEC-24, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### DEMO-003 — Import demo photos/documents without resetting other data

**العنوان العربي:** استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: DEMO-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P3 | Proposed owner: Restricted technical operator | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: DEMO-001, DEMO-002.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: import demo photos/documents without resetting other data, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Demo data workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Restricted technical operator; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Restricted technical operator with explicit written approval; not normal staff access.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify target is expected demo academy and approved media provenance. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Back up before non-destructive media import and use authorised account selector. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الحساب ضمن إجراء «استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Validate cached/local image and 24 bilingual PDF attachments. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع التاريخ ضمن إجراء «استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Check imported files without resetting accounts bookings or financial data. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز والحساب ضمن إجراء «استيراد الصور والمستندات التجريبية دون إعادة ضبط السجلات الأخرى»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Demo data workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Fictional records never establish real club facts; destructive reset requires distinct explicit authorisation. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified demo data record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Fictional records never establish real club facts; destructive reset requires distinct explicit authorisation. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§2, 23, 24, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-20, DEC-24, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.

## FORM APPLICABILITY / ارتباط النماذج

See `Riyadh_Polo_Club_SOP_Forms_Traceability_v1.0.2_DRAFT.md` and the companion 65-form controlled library. Refer to the application as the authoritative system of record. All forms remain proposed until owner approval.